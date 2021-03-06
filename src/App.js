import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if(list){
    return JSON.parse(localStorage.getItem('list'))
  }
  else {
    return []
  }
}


function App() {
    const [name, setName] = useState('');
    const [list, setList] = useState(getLocalStorage());
    const [isEditing, setIsEditing] = useState(false);
    const [editID, setEditID] = useState(null);
    const [alert, setAlert] = useState({ show: false, msg: '', type:''});

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!name) {
      // Display Alert
      //setAlert({show: true, msg: 'Please Enter Values', type: 'danger'})
      showAlert(true, 'danger', 'Please Enter Values...');
    } else if (name && isEditing){
      // Deal with Edit
      setList(list.map((item) => {
        if(item.id === editID) {
          return { ...list, title : name}
        }
        return item
      }))
      setName('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true, 'success', 'Value Changes');
    } else {
      showAlert(true, 'success', 'Item Successfully added to List')
      const newItem = { id: new Date().getTime().toString(), title: name};
      setList([...list, newItem]);
      setName('')
    }
  }

  const clearList = () => {
    showAlert(true, 'danger', 'empty list');
    setList([]);
  }

  const showAlert = (show=false, type="", msg="") => {
    setAlert({show, type, msg});
  }

  const removeItem = (id) => {
    showAlert(true, 'danger', 'Item Removed');
    setList(list.filter((item) => item.id !== id))
  }

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id == id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  }

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  }, [list])

  return (
  <section className='section-center'>
    <form className='grocery-form' onSubmit={handleSubmit}>
      {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>}
      <h3>Grocery Bud</h3>
      <div className='form-control'>
        <input type="text" className="grocery" placeholder="e.g. eggs" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit" className="submit-btn">
          {isEditing ? 'Edit' : 'Submit'}
        </button>

      </div>
    </form>
    {list.length > 0 &&
      <div className='grocery-container'>
      <List items={list} removeItem={removeItem} editItem={editItem} />
      <button className='clear-btn' onClick={clearList}>Clear Items</button>
      </div>
    }
  </section>
  )
}

export default App
