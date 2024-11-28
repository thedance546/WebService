// src/pages/AdminPage.js
import React, { useState } from "react";
import { Container, Nav, Tab, Table, Form, Button } from "react-bootstrap";
import LogoutButton from "../components/molecules/LogoutButton";

function AdminPage() {
  const [users, setUsers] = useState([
    { id: 1, username: "user1", email: "user1@example.com" },
    { id: 2, username: "user2", email: "user2@example.com" },
  ]);
  const [posts, setPosts] = useState([
    { id: 1, title: "Post 1", content: "Content 1", author: "user1" },
    { id: 2, title: "Post 2", content: "Content 2", author: "user2" },
  ]);
  const [search, setSearch] = useState("");

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const deletePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="mt-4">
      <h2>Admin Page</h2>
      <Tab.Container defaultActiveKey="users">
        <Nav variant="pills" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="users">User Management</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="posts">Post Management</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="settings">Settings</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="users">
            <h3>Users</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <Button variant="danger" onClick={() => deleteUser(user.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab.Pane>
          <Tab.Pane eventKey="posts">
            <h3>Posts</h3>
            <Form.Control
              type="text"
              placeholder="Search posts"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-3"
            />
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Content</th>
                  <th>Author</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.id}</td>
                    <td>{post.title}</td>
                    <td>{post.content}</td>
                    <td>{post.author}</td>
                    <td>
                      <Button variant="danger" onClick={() => deletePost(post.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab.Pane>
          <Tab.Pane eventKey="settings">
            <h3>Settings</h3>
            <LogoutButton />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}

export default AdminPage;
