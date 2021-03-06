import type { FC } from 'react';
import { BlockObject } from '../lib/notion/types';
import {
  ListItem,
  OrderedList,
  UnorderedList,
  ListIcon,
} from '@chakra-ui/react';
import { RichText } from './RichText';
import React from 'react';

type Props = {
  blockObj: BlockObject;
  previousType?: BlockObject['type'] | undefined;
  isChild?: boolean;
  depth?: number;
};

// FIXME: クソコードオブザイヤー
// TODO: ordered listを正しい順番で表示したい
export const List: FC<Props> = ({
  blockObj,
  previousType,
  isChild = false,
}) => {
  if (!['bulleted_list_item', 'numbered_list_item'].includes(blockObj.type)) {
    return null;
  }

  const renderListItems = () => {
    return (
      <>
        <ListItem>
          <RichText
            richTextArray={
              blockObj.type === 'bulleted_list_item'
                ? blockObj.bulleted_list_item.rich_text
                : blockObj.type === 'numbered_list_item'
                ? blockObj.numbered_list_item.rich_text
                : null
            }
          ></RichText>
        </ListItem>
        {blockObj.children &&
          blockObj.children.map((child) => (
            <React.Fragment key={child.id}>
              <List
                blockObj={child}
                previousType={
                  blockObj.children.length > 1 ? blockObj.type : child.type
                }
                isChild={true}
              ></List>
            </React.Fragment>
          ))}
      </>
    );
  };

  const buildListDom = () => {
    if (
      blockObj.type === 'bulleted_list_item' &&
      (previousType === undefined || blockObj.type !== previousType || isChild)
    ) {
      return (
        <UnorderedList pl={6} m={0}>
          {renderListItems()}
        </UnorderedList>
      );
    } else if (
      blockObj.type === 'numbered_list_item' &&
      (previousType === undefined || blockObj.type !== previousType || isChild)
    ) {
      return (
        <OrderedList pl={6} m={0}>
          {renderListItems()}
        </OrderedList>
      );
    } else if (blockObj.type === 'numbered_list_item') {
      return <>{renderListItems()}</>;
    } else if (blockObj.type === 'bulleted_list_item') {
      return <>{renderListItems()}</>;
    }
  };

  return <>{buildListDom()}</>;
};
6;
