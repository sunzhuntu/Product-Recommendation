This project implements four traditional recommendation methods, including most-popular, userknn, itemknn and matrix factorization. The recommendation results are displayed in the recommendation component.

## Backend Code
* The backend code for handling the http request on recommendation is under the directory "controllers/recommendation.js" and "server/server.js"

## Frontend Code

* The frontend code for displaying the recommendation results is under the directory "src/components/Recommendation.js"

* The frontend code for making the http request on recommendation is under the directory "src/services/recommendation_service.js"

## How to Run the Code

* Under the root directory of the project, using "npm start" to start the browser

* Under the root directory of the project, using "npm run dev" to start the backend server

**Note: there is also another change on the server side (line 84 in "server/server.js") when handling the adding products post request. Instead of saving the product id into the user table, we save the product title into the user table. Therefore, the original code "user.products = user.products.concat(savedProduct._id)" has been replaced by the code "user.products = user.products.concat(savedProduct.title)"**
