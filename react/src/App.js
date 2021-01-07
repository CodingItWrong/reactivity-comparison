import {useState} from 'react';
import './App.css';

function App() {
  const [newWidgetName, setNewWidgetName] = useState('');
  const [widgets, setWidgets] = useState([]);

  const handleAddWidget = e => {
    e.preventDefault();
    setWidgets([...widgets, newWidgetName]);
    setNewWidgetName('');
  }

  return (
    <div>
      <h1>Widgets</h1>
      <form onSubmit={handleAddWidget}>
        <input type="text" placeholder="Widget" value={newWidgetName} onChange={e => setNewWidgetName(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {widgets.map(widget => (<li>{widget}</li>))}
      </ul>
    </div>
  );
}

export default App;
