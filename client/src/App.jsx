import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ListHeader from "./components/ListHeader"
import ListItem from "./components/ListItem";
import Auth from "./components/Auth";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken
  const userEmail= cookies.Email
  const [tasks, setTasks] = useState(null);

  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:4000/todos/${userEmail}`)
      const json = await response.json();
      setTasks(json);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(authToken) {
      getData()
    }},[])
  
  console.log(tasks);
  // Sort by date
  const sortedTasks = tasks?.sort((a,b) => new Date(a.created_at) - new Date(b.created_at))

  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken && 
      <>
        <ListHeader listName={'Holiday Tick List'} getData={getData} />
        <p className="user-email">Welcome back {userEmail}</p>
        {sortedTasks?.map((task) => <ListItem key={task.id} task={task} getData={getData} />)}
      </>}
      <p className="copyright">Creative Coding LLC</p>
    </div>
  )
}

export default App
