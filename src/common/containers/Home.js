import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import logo from '../../assets/logo.svg';
import Post from '../components/Post';
import { getPostsByIds } from '../reducers/views/overview';
import { actions } from '../reducers/entities/posts';

class Home extends PureComponent {
  componentDidMount() {
    this.props.fetchPosts();
  }

  render() {
    const { posts, error, isLoading } = this.props;

    if (Object.keys(posts).length === 0 && isLoading) {
      return 'Loading...';
    }

    if (error) {
      return 'ERROR';
    }

    return (
      <div className="home">
        <img src={logo} alt={'Logo'} />
        {error && <div>{JSON.stringify(error)}</div>}
        <div className="posts">
          {posts && posts.map(post => <Post key={post.id} {...post} />)}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  posts: getPostsByIds(state),
  ...state.views.overview
});

export default connect(mapStateToProps, actions)(Home);