import React, { useEffect, useState, useContext } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import LikeActive from "../img/likeActive.png";
import LikeInactive from "../img/likeInactive.png";

firebase.initializeApp({
  apiKey: "AIzaSyB4SxJqOCjNH20_asnCLZSVrrbfXAqdDNU",
  authDomain: "chat-d4bd5.firebaseapp.com",
  projectId: "chat-d4bd5",
  storageBucket: "chat-d4bd5.appspot.com",
  messagingSenderId: "1059431591573",
  appId: "1:1059431591573:web:1232218496b0fe58c0759c"
});

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [postMessage, setPostMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);

  const getAuthenticatedUser = async () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
      }
    });
  }

  const observePosts = async () => {
    const path = window.location.pathname.split('/');
    const id = path[path.length - 1];

    const docRef = firebase.firestore().collection("users").doc(`${id}`);
    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      let data = docSnapshot.data()
      setUserData(data);

      firebase.firestore().collection(`users/${data.uid}/posts`).onSnapshot(snapshot => {
        let receivedPosts = snapshot.docs.map(doc => {
          let data = doc.data()
          let createdAt = data.createdAt.toDate()
          let formattedCreatedAt = `${createdAt.toLocaleDateString()} at ${createdAt.toLocaleTimeString()}`;

          return {
            message: data.message,
            id: doc.id,
            createdAt: formattedCreatedAt
          }
        })
  
        setPosts(receivedPosts)
      })
    }
  }

  const observeLikes = async (post) => {
    firebase.firestore().collection(`users/${userData.uid}/posts/${post.id}/likes`).onSnapshot(snapshot => {
      let likes = snapshot.docs.map(doc => {
        let data = doc.data()
        return {
          uid: data.uid
        }
      })

      setLikes(likes)
    })
  }

  const sendPost = async () => {
    const collectionRef = firebase.firestore().collection(`users/${currentUser.uid}/posts`);
    
    await collectionRef.add({
      message: postMessage,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date())
    });

    setPostMessage("")
  }

  const handleLike = async (post) => {
    const collectionRef = firebase.firestore().collection(`users/${userData.uid}/posts/${post.id}/likes`);
   
    await collectionRef.doc(currentUser.uid).set({
      uid: currentUser.uid
    })
  }

  const handleDislike = async (post) => {
    const collectionRef = firebase.firestore().collection(`users/${userData.uid}/posts/${post.id}/likes`);
   
    await collectionRef.doc(currentUser.uid).delete()

    console.log(likes);
  }

  useEffect(() => {
    getAuthenticatedUser()
    observePosts()
  }, [currentUser?.uid]);

  return (
    <div className='profileContainer'>
      {userData != null && currentUser != null ? (
        <div className='wrapper'>
          <img src={userData.photoURL} className="avatar" />
          <h2 className='username'>{userData.displayName}</h2>
          <span className='email'>{userData.email}</span>
          <span className='uid'>({userData.uid})</span>

          {userData.uid === currentUser.uid ? (
            <div>
              <br />
              <input
                type="text"
                placeholder="Enter post text"
                onChange={(e) => setPostMessage(e.target.value)}
                value={postMessage}
              />
              <button onClick={() => {
                sendPost()
              }}>Post</button>
            </div>
          ) : (<div />)}    
        </div>
      ) : (<div />)}
      <div className='postsContainer'>
          {posts.length > 0 ? (
            posts.sort(function(a,b){
              const dateA = new Date(a.createdAt.replace(/(\d{2}).(\d{2}).(\d{4}) at (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1T$4:$5:$6'));
              const dateB = new Date(b.createdAt.replace(/(\d{2}).(\d{2}).(\d{4}) at (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1T$4:$5:$6'));
              return dateB - dateA;
            }).map((post) => (
              <div key={post.id} className="post" onLoad={() => {observeLikes(post)}}>
                  <header>
                    <img className='avatar' src={userData.photoURL} />
                    <div className='info'>
                      <h4>{userData.displayName}</h4>
                      <span className='email'>{userData.email}</span>
                    </div>
                  </header>
                  <br />
                  <span>{post.message}</span>
                  <br /><br /><hr />
                  <footer>
                    <h5>{post.createdAt}</h5>
                    <div className='likeSection'>
                      <span>{ likes.length }</span>
                      {
                        (
                          likes.find(like => like.uid === currentUser.uid) === -1 
                          || likes.find(like => like.uid === currentUser.uid) === undefined
                        ) && currentUser.uid !== userData.uid ? (
                          <img src={LikeInactive} className='like' onClick={() => {handleLike(post)}} />
                        ) : (
                          <img src={LikeActive} className='like' onClick={() => {
                            if (currentUser.uid !== userData.uid) {
                              handleDislike(post)
                            }
                          }} />
                        )
                      }
                    </div>
                  </footer>
              </div>
            ))
          ) : (
            <div className='stub'>
              There's no posts 🥺
            </div>
          )}
        </div>
    </div>
  );
};

export default Profile;