from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
from flask_cors import CORS
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')


#Get saved model
model=joblib.load('model.pkl')


app=Flask(__name__)

CORS(app, origins="http://localhost:3000", supports_credentials=True)

#Define columns
features=["RevolvingUtilizationOfUnsecuredLines", "age", "NumberOfTime30-59DaysPastDueNotWorse", "DebtRatio", "MonthlyIncome", "NumberOfOpenCreditLinesAndLoans", "NumberOfTimes90DaysLate", "NumberRealEstateLoansOrLines", "NumberOfTime60-89DaysPastDueNotWorse"]

#Helper function for processing data into a dataframe
def process(data, features):
    values=[]
    del data['info_submit']
    for value in data.values():
        
        values.append(float(value))
    data2=np.array([values])
    data3=pd.DataFrame(data=data2, columns=features)
    return data3

#Helper function to predict
def predict(data, model):
    prediction=model.predict(data)
    return prediction


#Route for predict
@app.route('/predict', methods=['POST'])

def predict_route():
    data=request.json


    data4=process(data, features)

    prediction=predict(data4, model)


    return jsonify({'prediction': int(prediction[0])})

#Route for creating and saving visualization.
@app.route('/visualize', methods=['POST'])

def visualize_route():
    data=request.json
    
    data2=data.get('data')
    data2=data2.get('data')
    
    plt.figure()
    sns.histplot(data2, color='yellow')
    plt.title("Number of Approved and Denied")
    plt.xlabel("Approved vs Denied")
    plt.ylabel("Counts")
    plt.xticks(ticks=[0,1], labels=["Approved", "Denied"])
    plt.savefig("public/images/visualize.png")  #Figure is saved in the route and served in the html as img.
    plt.close()

    denied=data.get("denied")
    denied2=denied.get("denied")
    approved=data.get("approved")
    approved2=approved.get("approved")
    approved=pd.DataFrame(approved2, columns=["Income"]) #Create dataframe with approved income with column called income.
    approved['Status']='Approved'   #Add a status column with all approved value for all the approved income.
    denied=pd.DataFrame(denied2, columns=["Income"])  #Denied income.
    denied['Status']='Denied'  #Add a status column for all denied income.
    df=pd.concat([approved, denied])  #Combine both approved and denied into one dataframe.
    plt.figure()
    sns.boxplot(data=df, x=df['Status'], y=df['Income'])
    plt.title("Distribution of Approved and Denied")
    plt.savefig("public/images/visualize2.png")
    plt.close()

    return jsonify({"success": True})


    


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5002)


