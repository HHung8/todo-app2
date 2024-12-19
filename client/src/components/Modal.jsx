import { useState } from 'react'
import { useCookies } from 'react-cookie'

const Modal = ({mode, setShowModal, getData, task}) => {
  const [cookies, setCookie, removeCookie] = useCookies(['Email']);
  const editMode = mode === 'edit' ? true : false

  const [data, setData] = useState({
    user_email: editMode ? task?.user_email : cookies.Email,
    title: editMode ? task?.title : null,
    progress: editMode ? task?.progress : 50,
  })

  const postData =  async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/todos', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
      console.log( `Check response Submit`, response)
      if(response.status === 200) {
        console.log('WORKED');
        setShowModal(false);
        getData();
      }
    } catch (err) {
      console.error(err)
    }
  }
  
  const editData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/todos/${task.id}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(data),
      })
      if(response.status === 200) {
          setShowModal(false);
          getData();
      }
    } catch (error) {
      console.err(error)
    }
  }

  const handleChange = (e) => {
    console.log('Changing', e)
    const {name, value} = e.target;
    setData(data => ({...data, [name]:value})) 
    console.log(data)
  }

  return (
    <div className='overlay'>
      <div className='modal'>
          <div className='form-title-container'>
            <h3>Let's {mode} you task</h3>
            <button onClick={() => setShowModal(false)}>X</button>
          </div>
          <form>
              <input required maxLength={30} placeholder='Your task goes here' name='title' value={data.title} onChange={handleChange} /> 
              <br />
              <label htmlFor="range">Drag to select your current progress</label>
              <input required id="range" type='range' min="0" max="100" name="progress" value={data.progress} onChange={handleChange} />
              <input className={mode} type="submit" onClick={editMode ? editData : postData} />
          </form>
      </div>
    </div>
  )
}

export default Modal