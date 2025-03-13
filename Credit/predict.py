

from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
from flask_cors import CORS


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
    

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5002)




