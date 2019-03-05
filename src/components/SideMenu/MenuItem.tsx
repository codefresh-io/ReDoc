import { observer } from 'mobx-react';
import * as React from 'react';

import { ShelfIcon } from '../../common-elements/shelfs';
import { IMenuItem, OperationModel } from '../../services';
import { shortenHTTPVerb } from '../../utils/openapi';
import { MenuItems } from './MenuItems';
import { MenuItemLabel, MenuItemLi, MenuItemTitle, OperationBadge } from './styled.elements';

export interface MenuItemProps {
  item: IMenuItem;
  onActivate?: (item: IMenuItem) => void;
  onDeactivate?: (item: IMenuItem) => void;
  withoutChildren?: boolean;
}

@observer
export class MenuItem extends React.Component<MenuItemProps> {
  ref: Element | null;

  onClick = (evt: React.MouseEvent<HTMLElement>) => {
    const item = this.props.item;
    if (item.expanded) {
      this.props.onDeactivate!(item);
    } else {
      this.props.onActivate!(item);
    }
    evt.stopPropagation();
  };

  componentDidMount() {
    this.scrollIntoViewIfActive();
  }

  componentDidUpdate() {
    this.scrollIntoViewIfActive();
  }

  scrollIntoViewIfActive() {
    if (this.props.item.active && this.ref) {
      this.ref.scrollIntoViewIfNeeded();
    }
  }

  saveRef = ref => {
    this.ref = ref;
  };

  render() {
    const { item, withoutChildren } = this.props;
    return (
      <MenuItemLi
        onClick={this.onClick}
        depth={item.depth}
        ref={this.saveRef}
        data-item-id={item.id}
      >
        {item.type === 'operation' ? (
          <OperationMenuItemContent {...this.props} item={item as OperationModel} />
        ) : (
          <MenuItemLabel depth={item.depth} active={item.active} type={item.type}>
            <MenuItemTitle title={item.name}>
              {item.name}
              {this.props.children}
            </MenuItemTitle>
            {(item.depth > 0 &&
              item.items.length > 0 && (
                <ShelfIcon float={'right'} direction={item.expanded ? 'down' : 'right'} />
              )) ||
              null}
          </MenuItemLabel>
        )}
        {!withoutChildren &&
          item.items &&
          item.items.length > 0 && (
            <MenuItems
              expanded={item.expanded}
              items={item.items}
              onActivate={this.props.onActivate}
              onDeactivate={this.props.onDeactivate}
            />
          )}
      </MenuItemLi>
    );
  }
}

export interface OperationMenuItemContentProps {
  item: OperationModel;
}

@observer
class OperationMenuItemContent extends React.Component<OperationMenuItemContentProps> {
  render() {
    const { item } = this.props;
    return (
      <MenuItemLabel depth={item.depth} active={item.active} deprecated={item.deprecated}>
        <OperationBadge type={item.httpVerb}>{shortenHTTPVerb(item.httpVerb)}</OperationBadge>
        <MenuItemTitle width="calc(100% - 38px)">
          {item.name}
          {this.props.children}
        </MenuItemTitle>
      </MenuItemLabel>
    );
  }
}
