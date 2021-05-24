import React, { useReducer, useState, useEffect } from 'react';
import { getStories } from '../utils/api';
import PropTypes from 'prop-types';
import Item from './StoryItem';
import Loading from './Loading';

export function StoryList({ stories }) {
  return (
    <ul className="posts">
      {stories.map((story) => {
        const { by, descendants, time, title, url, id } = story;

        return (
          <Item
            key={url}
            title={title}
            username={by}
            time={time}
            comments={descendants}
            href={url}
            postID={id}
          />
        );
      })}
    </ul>
  );
}

StoryList.propTypes = {
  stories: PropTypes.array.isRequired,
};

function storiesReducer(state, action) {
  if (action.type === 'success') {
    return {
      ...state,
      stories: action.stories,
      loading: action.loading,
    };
  } else if (action.type === 'error') {
    return {
      ...state,
    };
  } else {
    throw new Error('The action type is not supported');
  }
}

export default function Stories({ location }) {
  const selection = location.pathname === '/' ? 'Top' : 'New';

  const [state, dispatch] = useReducer(storiesReducer, {
    stories: null,
    loading: true,
  });

  useEffect(() => {
    getStories(selection)
      .then((res) => Promise.all(res))
      .then((data) => {
        console.log(data);
        dispatch({
          type: 'success',
          stories: data,
          loading: false,
        });
      });
  }, [selection]);

  return (
    <React.Fragment>
      {state.loading && <Loading />}
      {/* need to check if stories exist bc of async */}
      {state.stories && <StoryList stories={state.stories} />}
    </React.Fragment>
  );
}
