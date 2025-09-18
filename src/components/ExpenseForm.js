import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faTrash } from '@fortawesome/free-solid-svg-icons';

const ExpenseForm = () => {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [total, setTotal] = useState(0);
  const [editId, setEditId] = useState(null);

  
  useEffect(() => {
    fetch("https://expense-backend-sky8.onrender.com/api/")
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setItems(data);
        setTotal(data.reduce((acc, item) => acc + item.amount, 0));
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  
  const handleAdd = () => {

    if (!title || !amountInput) return;
    const newItem = {
      title,
      amount: Number(amountInput),
    };

    if (editId) {
  fetch(`https://expense-backend-sky8.onrender.com/api/${editId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem),
  })
    .then(res => res.json())
    .then(updated => {
      const updatedItems = items.map(i => i._id === editId ? updated : i); 
      setItems(updatedItems);
      setTotal(updatedItems.reduce((acc, item) => acc + item.amount, 0));
      setEditId(null);
    });
}

     else {
      fetch("https://expense-backend-sky8.onrender.com/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })
        .then(res => res.json())
        .then(saved => {
          const newList = [...items, saved];
          setItems(newList);
          setTotal(total + saved.amount);
        });
    }
    setTitle('');
    setAmountInput('');
  };

  const Delete = (id) => {
  if (!id) return console.error("No ID provided for delete");

  console.log("Deleting item with id:", id);

  fetch(`https://expense-backend-sky8.onrender.com/api/${id}`, { method: "DELETE" })
    .then(() => {  
      const updated = items.filter(item => item._id !== id);
      setItems(updated);
      setTotal(updated.reduce((acc, item) => acc + item.amount, 0));
    })
    .catch(err => console.error("Delete error:", err));
   };


  const handleModify = (id) => {
  const itemToModify = items.find(item => item._id === id); // ✅ use _id
  if (itemToModify) {
    setTitle(itemToModify.title);
    setAmountInput(itemToModify.amount.toString());
    setEditId(id);
  }
};


  return (
    <div className='f'>
      <div className="form">
        <input
          type="text"
          placeholder='Title'
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder='Amount'
          value={amountInput}
          onChange={e => setAmountInput(e.target.value)}
        />
        <button onClick={handleAdd}>{editId ? "Update" : "Track"}</button>
        <div className="total">
          <h2>Total : {total}</h2>
        </div>
      </div>
      <div className="result">
        {items.map(i =>
          <div className="ex" key={i._id}>
            <h3>{i.title}:</h3>
            <h3>{i.amount}</h3>
            <button onClick={() => Delete(i._id)}>
              {console.log(i.id)}
              <FontAwesomeIcon icon={faTrash} style={{ color: "#f1094e" }} />
            </button>
            <button onClick={() => handleModify(i._id)}>
              <FontAwesomeIcon icon={faGear} style={{ color: "#63E6BE" }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseForm;
