const RecommendationRouter = require('express').Router()
const mf = require('matrix-factorization')
const User = require('../models/user')

/**
 * Recommender Systems: Most Popular
*/
RecommendationRouter.get('/MostPop', async (request, response) => {

  console.log('handle http get request')
  const allusers = await User.find({})
  let products = new Array() //all products rated by all users

  allusers.map(user => {
    products = products.concat(user.products);
  })

  //compute the # of occurance of each product
  //allproducts is an object which is used to record the occurrance of each product
  //count_product {product:count}
  let count_product = products.reduce(function (allproducts, product) {
    if (product in allproducts) {
      allproducts[product]++
    } else {
      allproducts[product] = 1
    }
    return allproducts
  }, {})

  //sort all items in a descending order
  //Recommend_list is an array which contains the sorted products by their popularity
  let Recommend_list = Object.keys(count_product).sort(function (a, b) { return count_product[b] - count_product[a] })

  const TopK = 10
  let length = Recommend_list.length > TopK ? TopK : Recommend_list.length
  response.json(Recommend_list.slice(0, length))
})

/**
 * Recommender Systems: UserKNN
*/
RecommendationRouter.post('/UserKNN', async (request, response, next) => {
  const body = request.body
  console.log('handle http post request')
  console.log(body)
  const userid = body.username
  const allusers = await User.find({})

  let all_users_items = {} //all user-item interactions {uid: [rated products]}

  allusers.map(user => {
    let uid = user.username
    let products = user.products //all added products in an array of user uid
    if (!all_users_items[uid]) {
      all_users_items[uid] = products //user and his correpsonding added products
    }
  })

  //computing similarity between the target user and the rest users in the system
  let neighbor_users = {} //in the format of {uid: common_item_number}
  let target_user_items = all_users_items[userid] //target user's added products
  for (let uid in all_users_items) {
    if (uid == userid) continue
    let other_user_items = all_users_items[uid]
    //find out the intersection of their added items 
    let common_items = target_user_items.filter(value => other_user_items.includes(value))
    if (!neighbor_users[uid]) {
      neighbor_users[uid] = common_items.length
    }
  }

  let neighbor_user_similarity = [] //an array of object [{id:userid, similarity:score}]

  Object.keys(neighbor_users).map(uid => {
    //Jaccard similarity
    let similarity = (neighbor_users[uid] + 0.0) / (target_user_items.length + all_users_items[uid].length - neighbor_users[uid])
    neighbor_user_similarity = neighbor_user_similarity.concat({ id: uid, similarity: similarity })
  })

  //sort the similarity in an descending order
  neighbor_user_similarity.sort((a, b) => b.similarity - a.similarity)

  console.log(neighbor_user_similarity)
  const k = 3 //the number of k-nearest neighbors 
  const TopK = 10
  let Recommend_list = []

  for (let i = 0; i < k; i++) {
    all_users_items[neighbor_user_similarity[i].id].map(item => {
      if (target_user_items.indexOf(item) == -1) {
        //in case of repeated recommendation
        target_user_items = target_user_items.concat(item)
        Recommend_list = Recommend_list.concat(item)
      }
    })
  }
  let length = Recommend_list.length > TopK ? TopK : Recommend_list.length
  response.json(Recommend_list.slice(0, length))
})


/**
 * Recommender Systems: ItemKNN
*/
RecommendationRouter.post('/ItemKNN', async (request, response, next) => {
  const body = request.body
  console.log('handle http post request')
  console.log(body)
  const userid = body.username
  const allusers = await User.find({})

  /**
   * the items and all users that have interaction with this item
   * in the format of {itemid: [users that rated this item]}
  */
  let item_users = {}
  let target_user_items = []  // the items that the target user has rated

  allusers.map(user => {
    let uid = user.username
    let products = user.products
    products.map(idx => {
      if (!item_users[idx]) item_users[idx] = []
      item_users[idx] = item_users[idx].concat(uid)
    })
    if (uid == userid) {
      target_user_items = user.products
    }
  })

  /*item_similarity is in the format of {itemid, [{id: itemid, similiarity: score}, ....]} 
  * to save the similarity between items that have been rated by the target user 
  * and the rest unrated items
  */
  let item_similarity = {}

  for (let targetid in target_user_items) {
    target_item = target_user_items[targetid]
    let neighbor_item_similarity = []
    for (let itemid in item_users) {
      if (target_item == itemid) continue
      let common_users = item_users[target_item].filter(value => item_users[itemid].includes(value))
      //Jaccard similarity
      let similarity = (common_users.length + 0.0) / (item_users[target_item].length + item_users[itemid].length - common_users.length)
      neighbor_item_similarity = neighbor_item_similarity.concat({ id: itemid, similarity: similarity })
    }
    if (!item_similarity[target_item]) {
      item_similarity[target_item] = neighbor_item_similarity
    }
  }

  //sort the similarity in a descending order
  //item_similarity = {itemid, [{id: itemid, similarity: score}, ....]}
  Object.keys(item_similarity).map(item => {
    item_similarity[item].sort((a, b) => b.similarity - a.similarity)
  })

  const k = 2 //the number of k-nearest neighbors 
  const TopK = 10
  let Recommend_list = []

  for (let target_item in item_similarity) {
    if (Recommend_list.length > TopK) break
    let neighborcount = 0
    for (let iid in item_similarity[target_item]) {
      if (Recommend_list.length > TopK || neighborcount >= k) break
      neighbor_item = item_similarity[target_item][iid].id //get the neighbr itemid
      if (target_user_items.indexOf(neighbor_item) == -1) {
        Recommend_list = Recommend_list.concat(neighbor_item)
        //avoid repeated recommendation
        target_user_items = target_user_items.concat(neighbor_item)
        neighborcount += 1
      }
    }
  }
  response.json(Recommend_list)
})


/**
 * Recommender Systems: Matrix Factorization
 */
RecommendationRouter.post('/MF', async (request, response, next) => {
  const userid = request.body.username
  console.log(userid)
  const allusers = await User.find({})

  let user_items = {} //the user and his rated item set: {user, [rated items]}
  let userset = new Set() //used to construct the row of the matrix
  let itemset = new Set() //used to construct the column of the matrix

  allusers.map(user => {
    let uid = user.username
    let products = user.products
    userset.add(uid)
    products.map(idx => itemset.add(idx))
    user_items[uid] = products
  })

  let uiMatrix = [] //user-item interaction matrix
  let userArray = Array.from(userset)
  let itemArray = Array.from(itemset)
  for (let row_index = 0; row_index < userArray.length; row_index++) {
    let user_row = new Array(itemArray.length)
    for (let col_index = 0; col_index < itemArray.length; col_index++) {
      if (user_items[userArray[row_index]].indexOf(itemArray[col_index]) == -1) {
        user_row[col_index] = 0
      } else {
        user_row[col_index] = 1
      }
    }
    uiMatrix = uiMatrix.concat([user_row])
  }

  const LatentFeature = 3 //size of latent feature
  let User_Item_Matrix = mf.factorizeMatrix(uiMatrix, LatentFeature)
  let completeMatrix = mf.buildCompletedMatrix(User_Item_Matrix)
  //console.log(User_Item_Matrix)

  let target_user_row = userArray.indexOf(userid) 
  let prediction = {} //{itemid (not rated): rating}
  for (let j = 0; j < uiMatrix[target_user_row].length; j++) {
    if (uiMatrix[target_user_row][j] == 0) { //the target user has not rated this item
      let rating = completeMatrix[target_user_row][j]
      if (!prediction[itemArray[j]]) {
        prediction[itemArray[j]] = rating
      }
    }
  }

  const TopK = 3
  console.log(prediction)
  //sort the result in a descending order
  let Recommend_list = Object.keys(prediction).sort(function (a, b) { return prediction[b] - prediction[a] })
  console.log(Recommend_list)
  let length = Recommend_list.length > TopK ? TopK : Recommend_list.length
  response.json(Recommend_list.slice(0, length))
})

module.exports = RecommendationRouter