import React, {useReducer, useEffect} from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { getItem } from '../utils/api'
import Item from './StoryItem'
import { ThemeConsumer } from '../context/theme'
import { Link } from 'react-router-dom'
import Loading from './Loading'

function CommentsList ({comments}){ 
  //filter for dead comments
  comments = comments.filter(comment => !comment.dead && !comment.deleted)
  //extract the information you need for each comment
  
  
  return(

    <ThemeConsumer>
      {({theme}) => (

          <ul className='comments'>
            {/* map over each comments and display it */}
            {comments.map(comment => {
              const {by, time, text} = comment

              let date = new Date(time*1000)
              date = `${date.toLocaleDateString()}, ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`

        
              return(
                <li className='comment' key={comment.id}>
                  <div className={`meta-info-${theme}`}>
                    <span>by <Link
                      to = {{
                        pathname: '/user',
                        search: `?id=${by}`
                      }}      
                    >
                      <button className="username btn-clear">{by}</button>
                    </Link></span>
                    <span> on {date}</span>
                  </div>
                  <div dangerouslySetInnerHTML = {{__html:text}}>
                  
                  </div>


                </li>
              )
            })}
          </ul>
      )}
    </ThemeConsumer>
  )

}

function postReducer (state, action) {
  if(action.type === 'success') {
    return {
      ...state,
      title: action.title,
      username: action.username,
      time: action.time,
      numComments: action.numComments,
      comments: action.comments,
      href: action.href,
      id: action.id,
      loading: false

    }
  }else if(action.type === 'error'){
    return {
      ...state,

    }
  }else{
    throw new Error ('The action type is not supported')
  }
}



export default function Post({location}) {
  const {id} = queryString.parse(location.search)
  const [state, dispatch] = useReducer(
    postReducer,
    {
      title: null,
      username: null,
      time: null,
      numComments: null,
      comments: null,
      href: null,
      id: null,
      loading: true
    }
  )
  useEffect(() =>{

    getItem(id)
    .then(post => {
      console.log(post)
      const {by, descendants, kids, time, title, url, id} = post

      if(!kids){
        dispatch({
          type: 'success',
          title: title,
          username: by,
          time: time,
          numComments: descendants,
          comments: [],
          href: url,
          id: id,
          loading: false
         })
      }else{
        Promise.all(kids.map(getItem))
          .then(comments => {
           dispatch({
            type: 'success',
            title: title,
            username: by,
            time: time,
            numComments: descendants,
            comments: comments,
            href: url,
            id: id,
            loading: false
           })
          })
      }
      


    })

  })

  return(
    <React.Fragment>
      {state.loading && <Loading/>}
      {!state.loading &&
        <div className = 'comment-posts'>
          <div className='commentPG-title'>
            {/* Post title */}
            <Item 
              key={state.href}
              title={state.title}
              username={state.username}
              time={state.time}
              comments={state.numComments}
              href={state.href}
              postID={state.id}
            />
          </div>
          {/* Comments */}
          {state.comments && <CommentsList comments={state.comments}/>}
        </div>
      }
    </React.Fragment>
  )




}

