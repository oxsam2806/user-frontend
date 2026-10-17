
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Store the users displayed on the page.
  const [users, setUsers] = useState([]);
  
  // Load saved users from the backend when the page opens.
  useEffect(() => {
    // Get all users from our Express API.
    async function fetchUsers() {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL);

        // Stop if the API returns an error.
        if (!response.ok) {
          throw new Error("Failed to load users.");
        }

        // Convert the response into JavaScript data.
        const data = await response.json();

        // Display the users returned by MongoDB.
        setUsers(data);
      } catch (error) {
        console.error("Error loading users:", error);
        setMessage("Could not load users. Please check the backend.");
      }
    }

    // Run the function.
    fetchUsers();
  }, []);


  // Store the values entered into the form.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  // Store a message to show the user.
  const [message, setMessage] = useState("");

  
  // Send the new user to our Express API.
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    // Make sure every field has a value.
    if (!name.trim() || !email.trim() || !age) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      // Send the user information to the backend.
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          age: Number(age),
        }),
      });

      // Read the response from the backend.
      const data = await response.json();

      // Display an error if the API rejects the request.
      if (!response.ok) {
        throw new Error(data.message || "Could not add user.");
      }

      // Add the saved user to the page.
      setUsers((previousUsers) => [...previousUsers, data]);

      // Clear the form after a successful save.
      setName("");
      setEmail("");
      setAge("");
      setMessage("User saved to MongoDB successfully!");
    } catch (error) {
      setMessage(error.message || "Could not connect to the API.");
    }
  }


  return (
    <main className="app">
      <h1>User Management App</h1>
      <p>Manage your users in one place.</p>

      <form onSubmit={handleSubmit} className="user-form">
        <label htmlFor="name">Full name</label>
        <input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter full name"
        />

        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter email"
        />

        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          min="1"
          value={age}
          onChange={(event) => setAge(event.target.value)}
          placeholder="Enter age"
        />

        <button type="submit">Add User</button>
      </form>

      {message && <p className="message">{message}</p>}

      <section className="users">
        <h2>Users ({users.length})</h2>

        {users.length === 0 ? (
          <p>No users added yet.</p>
        ) : (
          users.map((user) => (
            <article className="user-card" key={user._id}>
              <h3>{user.name}</h3>
              <p>Email: {user.email}</p>
              <p>Age: {user.age}</p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default App;
