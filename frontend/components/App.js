import React, { useState } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
import Spinner from './Spinner';
import axios from 'axios';
import { axiosWithAuth } from '../axios';

const articlesUrl = 'http://localhost:9000/api/articles';
const loginUrl = 'http://localhost:9000/api/login';

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate('/');
  };
  const redirectToArticles = () => {
    navigate('articles');
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    localStorage.removeItem('token');
    // and a message saying "Goodbye!" should be set in its proper state.
    setMessage('Goodbye!');
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    redirectToLogin();
  };

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage('');
    setSpinnerOn(true);
    // and launch a request to the proper endpoint.
    axios
      .post(loginUrl, {
        username: username,
        password: password
      })
      .then((response) => {
        // On success, we should set the token to local storage in a 'token' key,
        localStorage.setItem('token', response.data.token);
        // put the server success message in its proper state, and redirect
        setMessage(response.data.message);
        redirectToArticles();
      })
      .catch((error) => console.log(error))
      // to the Articles screen. Don't forget to turn off the spinner!
      .finally(() => setSpinnerOn(false));
  };

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage('');
    setSpinnerOn(true);
    // and launch an authenticated request to the proper endpoint.
    axiosWithAuth()
      .get(articlesUrl)
      .then((response) => {
        // On success, we should set the articles in their proper state and
        setArticles(response.data.articles);
        // put the server success message in its proper state.
        setMessage(response.data.message);
      })
      // If something goes wrong, check the status of the response:
      .catch((error) => {
        // if it's a 401 the token might have gone bad, and we should redirect to login.
        if (error.response.status === 401) {
          redirectToLogin();
        } else {
          console.log(error.response);
        }
      })
      // Don't forget to turn off the spinner!
      .finally(() => setSpinnerOn(false));
  };

  const postArticle = (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setSpinnerOn(true);
    setMessage('');
    axiosWithAuth()
      .post(articlesUrl, article)
      .then((response) => {
        setArticles([...articles, response.data.article]);
        setMessage(response.data.message);
      })
      .catch((error) => console.log(error))
      .finally(() => setSpinnerOn(false));
  };

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setSpinnerOn(true);
    setMessage('');
    axiosWithAuth()
      .put(`${articlesUrl}/${article_id}`, article)
      .then((response) => {
        setMessage(response.data.message);
        setArticles(
          articles.map((article) => {
            if (article.article_id === article_id) {
              return response.data.article;
            } else {
              return article;
            }
          })
        );
        setCurrentArticleId(null);
      })
      .catch((error) => console.log(error.response))
      .finally(() => setSpinnerOn(false));
  };

  const deleteArticle = (article_id) => {
    // ✨ implement
    setSpinnerOn(true);
    setMessage('');
    axiosWithAuth()
      .delete(`${articlesUrl}/${article_id}`)
      .then((response) => {
        setMessage(response.data.message);
        setArticles(articles.filter((article) => article.article_id !== article_id));
      })
      .catch((error) => console.log(error))
      .finally(() => setSpinnerOn(false));
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? '0.25' : '1' }}>
        {' '}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm currentArticle={currentArticleId ? articles.filter((article) => article.article_id === currentArticleId)[0] : null} setCurrentArticleId={setCurrentArticleId} updateArticle={updateArticle} postArticle={postArticle} />
                <Articles articles={articles} getArticles={getArticles} deleteArticle={deleteArticle} setCurrentArticleId={setCurrentArticleId} />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
