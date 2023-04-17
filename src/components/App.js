import { Container } from "./Container/Container";
import { useEffect, useState, useRef } from "react";
import { Dropdown } from "./Dropdown/Dropdown";
import { HomeLink } from "./HomeLink/HomeLink";
import { UserList } from "./UserList/UserList";
import { LoadMoreButton } from "./LoadMoreButton/LoadMoreButton";
import { Loader } from "./Loader/Loader";
import { Alert } from "./Alert/Alert";
const apiUrl = "https://6436fa4b3e4d2b4a12e09fd0.mockapi.io/api/users";

function App() {
  const limit = 9;

  const fetchUserData = async (filter) => {
    let url = null;
    switch (filter) {
      case "following":
        url = apiUrl + `?page=${followingPage}&limit=${limit}&isFollowing=true`;
        break;
      case "follow":
        url = apiUrl + `?page=${followPage}&limit=${limit}&isFollowing=false`;
        break;
      default:
        url = apiUrl + `?page=${page}&limit=${limit}`;
    }

    try {
      setLoading(true);
      const response = await fetch(url, {
        method: "GET",
        headers: { "content-type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`
        );
      }
      const data = await response.json();
      if (data) {
        switch (filter) {
          case "following":
            if (!followingUsers) {
              setFollowingUsers(data);
            }
            if (followingUsers) {
              followingUserCount <= limit
                ? setFollowingUsers(data)
                : setFollowingUsers((prevState) => [...prevState, ...data]);
            }
            break;
          case "follow":
            if (!followUsers) {
              setFollowUsers(data);
            }
            if (followUsers) {
              followUserCount <= limit
                ? setFollowUsers(data)
                : setFollowUsers((prevState) => [...prevState, ...data]);
            }
            break;
          default:
            !users
              ? setUsers(data)
              : setUsers((prevState) => [...prevState, ...data]);
        }
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id) => {
    try {
      const response = await fetch(apiUrl + `/${id}`, {
        method: "GET",
        headers: { "content-type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`
        );
      }

      const data = await response.json();
      const usersCopy = [...users];
      const userIndex = users.findIndex((user) => user.id === id);

      usersCopy[userIndex] = data;
      setUsers(usersCopy);
      switch (data.isFollowing) {
        case true:
          if (followUsers) {
            const followUsersCopy = [...followUsers];
            const followUserIndex = followUsers.findIndex(
              (user) => user.id === data.id
            );
            followUsersCopy.splice(followUserIndex, 1);
            setFollowUsers(followUsersCopy);
          }

          break;
        case false:
          if (followingUsers) {
            const followingUsersCopy = [...followingUsers];
            const followingUserIndex = followingUsers.findIndex(
              (user) => user.id === data.id
            );
            followingUsersCopy.splice(followingUserIndex, 1);
            setFollowingUsers(followingUsersCopy);
          }

          break;
        default:
          break;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserCount = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "content-type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`
        );
      }
      const data = await response.json();
      setUserCount(data.length);
      setFollowUserCount(
        data.filter((user) => user.isFollowing === false).length
      );
      setFollowingUserCount(
        data.filter((user) => user.isFollowing === true).length
      );
    } catch (err) {
      console.log(err);
      setUserCount(null);
    }
  };

  const changeFollowing = async (isFollowing, id, followers) => {
    fetch(apiUrl + `/${id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        isFollowing: !isFollowing,
        followers: !isFollowing ? followers + 1 : followers - 1,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(`This is an HTTP error: The status is ${res.status}`);
      })
      .then(() => {
        updateUser(id);
        getUserCount();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeFilter = (filter) => {
    switch (filter) {
      case "following":
        setFilter("following");
        if (!followingUsers) {
          fetchUserData("following");
        }
        break;
      case "follow":
        setFilter("follow");
        if (!followUsers) {
          fetchUserData("follow");
        }
        break;
      default:
        setFilter(null);
    }
  };

  const mountedRef = useRef(false);

  const [users, setUsers] = useState(null);
  const [followUsers, setFollowUsers] = useState(null);
  const [followingUsers, setFollowingUsers] = useState(null);
  const [userCount, setUserCount] = useState(null);
  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [followUserCount, setFollowUserCount] = useState(null);
  const [followingUserCount, setFollowingUserCount] = useState(null);
  const [followPage, setFollowPage] = useState(1);
  const [followingPage, setFollowingPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mountedRef.current === true) {
      fetchUserData();
      getUserCount();
    }
    return () => {
      mountedRef.current = true;
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (mountedRef.current === true) {
      fetchUserData();
    }
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    if (mountedRef.current === true) {
      fetchUserData("following");
    }
    // eslint-disable-next-line
  }, [followingPage]);

  useEffect(() => {
    if (mountedRef.current === true) {
      fetchUserData("follow");
    }
    // eslint-disable-next-line
  }, [followPage]);

  return (
    <Container>
      <HomeLink />
      {error && <Alert>{error}</Alert>}
      {!error && (
        <>
          <Dropdown
            changeFilter={changeFilter}
            fetchUserData={fetchUserData}
            followingUserCount={followingUserCount}
            followUserCount={followUserCount}
            limit={limit}
          />
          {users && !filter && (
            <UserList users={users} changeFollowing={changeFollowing} />
          )}
          {!filter && !loading && Math.ceil(userCount / limit) > page && (
            <LoadMoreButton onClick={() => setPage(page + 1)}>
              Load more
            </LoadMoreButton>
          )}
          {followUsers && filter === "follow" && (
            <UserList users={followUsers} changeFollowing={changeFollowing} />
          )}
          {filter === "follow" &&
            !loading &&
            Math.ceil(followUserCount / limit) > followPage &&
            followUserCount > limit && (
              <LoadMoreButton onClick={() => setFollowPage(followPage + 1)}>
                Load more
              </LoadMoreButton>
            )}
          {followingUsers && filter === "following" && (
            <UserList
              users={followingUsers}
              changeFollowing={changeFollowing}
            />
          )}
          {filter === "following" &&
            !loading &&
            Math.ceil(followingUserCount / limit) > followingPage &&
            followingUserCount > limit && (
              <LoadMoreButton
                onClick={() => setFollowingPage(followingPage + 1)}
              >
                Load more
              </LoadMoreButton>
            )}
        </>
      )}
      {filter === "following" && followingUserCount <= 0 && (
        <Alert>Theare are noone in followings</Alert>
      )}
      {filter === "follow" && followUserCount <= 0 && (
        <Alert>Theare are noone to follow</Alert>
      )}
      {loading && <Loader />}
    </Container>
  );
}

export default App;
