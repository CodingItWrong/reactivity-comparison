import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class WidgetListComponent extends Component {
  @tracked newWidgetName = '';
  @tracked widgets = [];

  @action
  handleAddWidget(e) {
    e.preventDefault();

    // doesn't work:
    // this.widgets.push(this.newWidgetName);

    // works:
    this.widgets = [...this.widgets, this.newWidgetName];

    this.newWidgetName = '';
  }
}
