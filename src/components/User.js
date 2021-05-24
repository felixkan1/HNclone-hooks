import React, {useReducer, useEffect} from 'react';
import { getUser, getItem } from '../utils/api'
import { StoryList } from './Stories'
import queryString from 'query-string'
import Loading from './Loading'



function getStories(posts){
  return posts.map(post =>{
    return getItem(post.id)
  })

}

function userReducer (state, action) {
  if(action.type === 'success') {
    return {
      ...state,
      created: action.created,
      user: action.user,
      karma: action.karma,
      about: action.about, 
      submitted: action.submitted,
      error: action.error,
      loading: action.loading

    }
  }else if(action.type === 'error'){
    return {
      ...state,

    }
  }else{
    throw new Error ('The action type is not supported')
  }
}


export default function User ({location}) {
  const {id} = queryString.parse(location.search)
  const [state, dispatch] = useReducer(
    userReducer,
    {
      created: null,
      user: null,
      karma:null,
      about: null, 
      submitted: null,
      error: null,
      loading: true
    }
  )

  useEffect(() => {
    getUser(id)
    .then(res => {
      const{created, id, karma, about, submitted} = res
      const topSubmitted = submitted.slice(0,30) //array of user submitted post IDs 

      //convert unix time to date time
      let date = new Date(created*1000)
      date = `${date.toLocaleDateString()}, ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
      
     
      //get all of the users posts
      Promise.all(topSubmitted.map(getItem))
        //filter by story
        .then(posts => {
            console.log(posts);
            posts = posts.filter( post => (post.type === "story" ))
            //posts is an array of objects of the users posts
            
            Promise.all(getStories(posts))
              .then(story => dispatch({
                type: 'success',
                created: date,
                user: id,
                karma:karma,
                about: about, 
                submitted: story,
                error: null,
                loading: false

              }))
          })

      
    })
  }, [id])

  const {created, user, karma, about, submitted,loading} = state

  return(
  
  <React.Fragment>
  {loading && <Loading/>}
   {!loading &&
   <div className ='userpage'>
      <div>
        <h1>{user}</h1>
        <div>
          joined {created} has <strong>{karma}</strong> karma
        </div>
        <br></br>
        <div dangerouslySetInnerHTML={{__html:about}}></div>
      </div>
      <h2>Posts</h2>
      {submitted && <StoryList stories = {submitted}/>}
   </div>
     
   }
  </React.Fragment>

  )

}

