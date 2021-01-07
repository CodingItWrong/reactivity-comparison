import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class WidgetListComponent extends Component {
  @tracked newWidgetName = '';
  @tracked widgets = [];

  @action
  handleAddWidget(e) {
    e.preventDefault();

    // https://guides.emberjs.com/release/upgrading/current-edition/tracked-properties/#toc_arrays
    // Arrays are another example of a type of object where you can't enumerate every possible value - after all, there are an infinite number of integers (though you may run out of bits in your computer at some point!). Instead, you can continue to use EmberArray, which will continue to work with tracking and will cause any dependencies that use it to invalidate correctly.
    // doesn't work:
    // this.widgets.push(this.newWidgetName);

    // works:
    this.widgets = [...this.widgets, this.newWidgetName];

    this.newWidgetName = '';
  }
}
