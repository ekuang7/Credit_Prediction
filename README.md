# Credit Prediction App

***Summary***

This credit app allows users to have their own personal account with register and login per person. The user enters some credit information such as
- Percentage of revolving credit 
- Age
- Number of times late in the past 2 years (30 days-59 days) 
- Number of times late in the past 2 years (60 days-89 days) 
- Number of times late in the past 2 years (90 days or more)
- Debt ratio
- Monthly income
- Number of credit lines opened
- Number of mortgages 

These inputs are inputted from the frontend by the user and axios sends it to a flask backend where a trained model uses those inputs and predict if the user is risky or not and sends it back to express and 
- Display the approved page if the user is deemed not at risk.
- Display declined page if user is at risk.

***Data and Modeling***

The data that was used to train and test the model was the givemesomecredit dataset. The data was cleaned by first dealing with the NA with data imputing using the median. There was also data inbalanced between the default and not default. There were 10 times more not defaults than defaults which made the data unbalanced. When initially training the model, the data accuracy was performing well enough in terms of accuracy but recall score was on the lower side. What was done was a sample of the not default one was selected randomly where I sampled the not default to be 2x the size of the default one and combine the default with the sampled not default to form a new dataset to be used. (Undersample) Several models were used such as logistic regression, decision tree, random forest was used to train and test the mode. Random forest model had the best results in terms of accuracy, recall and precision at about 80%, 62%, and 73% respectively. Seeing that the recall was low but is the more important scoring due to we want to make sure the model is able to predict accurately the true positives (the people who default/at risk),I focused on improving recall. Based on the model, it seem there might be an overfitting or the model was a bit overfitted so instead of using the full features, I checked the cumulative sum of all the features and the features that explained about 95%. Thus, number of dependent was dropped since it explained about 5%. Refitting the random forest model and rechecking the accuracy, recall, and precision, it was 80%, 73%, and 61% respectively. The recall score was increased by 10% while precision was decreased by 10% roughly. This model was deemed better because even though precision was decreased, recall is the more important score due to we want the model to be able to predict the true positives, since those are the ones that default/at risk (the one that can potentially cost profits/lost), whereas a lower precision, leads to a more conservative model. 

***Frontend***

In the frontend there are express handlebars pages that login, register, logout, error, input for credit, approved and declined page. Express routes are used to handle inputs in the frontend, sending input to flask and receiving a response back etc. 

***Technologies Used***

- Python: Python was used to clean the dataset, train the model and test the model.
- Javascript: Javascript was used to do the login, register backend as well as the backend routes. 
- CSS: CSS was used to style frontend pages for the UI. 
- HTML/express handlebars
- MongoDB: MongoDB was used to store information about the user.
- Flask: Flask was used to handle the backend route /predict where the model was saved using joblib into a pkl file to loaded back when /predict flask backend api is used to predict an output to send back to the frontend.

***Still Working On***

Things still working on currently...
- Working on a visualization page that display the users so far denied and approved.
- Working on an update information where user can update their account information and update their income or late information.
- Working on an owner of page where the owner can review approved applications and set the approved amount of credit.

  ***Notes**

  Must npm to get the dependencies and run the flask first before running the node. 


  
