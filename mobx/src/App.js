import { useState } from 'react';
import { makeObservable, observable, action } from "mobx";
import { observer } from "mobx-react-lite"

class WidgetStore {
  widgets = [];

  constructor() {
    makeObservable(this, {
      widgets: observable,
      addWidget: action,
    });
  }

  addWidget(name) {
    // https://mobx.js.org/api.html#observablearray
    // To convert observable arrays back to plain arrays, use the .slice() method, or check out toJS to convert them recursively. Besides all the language built-in array functions, the following goodies are available on observable arrays as well:…
    this.widgets.push(name);
  }
}

const widgetStore = new WidgetStore();

// somehow this rerenders even if I forget observer()??
const App = observer(() => {
  const [newWidgetName, setNewWidgetName] = useState('');

  const handleAddWidget = e => {
    e.preventDefault();
    widgetStore.addWidget(newWidgetName);
    setNewWidgetName('');
  }

  // actually widgets.map() seems to work fine in this case, but not in others

  return (
    <div>
      <h1>Widgets</h1>
      <form onSubmit={handleAddWidget}>
        <input type="text" placeholder="Widget" value={newWidgetName} onChange={e => setNewWidgetName(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {widgetStore.widgets.slice().map(widget => (<li>{widget}</li>))}
      </ul>
    </div>
  );
});

export default App;
