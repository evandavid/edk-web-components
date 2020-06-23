import { MDCMenuFoundation } from '@material/menu';

export class ModuitMenuFoundation extends MDCMenuFoundation {
  // private closeAnimationEndTimerId_ = 0;
  // private multipleSelection = false;
  // constructor(adapter?: Partial<MDCMenuAdapter>, multiple?: boolean) {
  //     super({ ...MDCMenuFoundation.defaultAdapter, ...adapter });
  //     this.multipleSelection = multiple;
  // }
  // handleItemAction(listItem: Element) {
  //     const index = this.adapter_.getElementIndex(listItem);
  //     if (index < 0) {
  //         return;
  //     }
  //     this.adapter_.notifySelected({ index });
  //     this.adapter_.closeSurface();
  //     console.log(this.adapter_);
  //     // Wait for the menu to close before adding/removing classes that affect styles.
  //     this.closeAnimationEndTimerId_ = setTimeout(() => {
  //         // Recompute the index in case the menu contents have changed.
  //         const recomputedIndex = this.adapter_.getElementIndex(listItem);
  //         if (this.adapter_.isSelectableItemAtIndex(recomputedIndex)) {
  //             this.setSelectedIndex(recomputedIndex);
  //         }
  //     }, 75);
  // }
}
