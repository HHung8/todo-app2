import Modal from './Modal';
import PostGressBar from './PostGressBar'
import TickIcon from './TickIcon'
import { useState } from 'react'

const ListItem = ({task, getData}) => {
  const [showModal, setShowModal] = useState(false);

  const deleteItem = async () => {
    try {
      const response = await fetch(`http://localhost:4000/todos/${task.id}`, {
        method: "DELETE",
      })
      if(response.status === 200) {
        getData();
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='list-item'>
      <div className='info-container'>
        <TickIcon />
        <p className='task-title'>{task.title}</p>
        <PostGressBar progress={task.progress} />
      </div>

      <div className='button-container'>
          <button className='edit' onClick={() => setShowModal(true)}>Edit</button>
          <button className='delete' onClick={deleteItem}>Delete</button>
      </div>

      {showModal && <Modal mode={'edit'} getData={getData} setShowModal={setShowModal} task={task}/>}
    </div>
  )
}

export default ListItem