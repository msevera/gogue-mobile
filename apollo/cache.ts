const mergeUnique = (existingItems = [], incoming, { mergeObjects, readField }) => {
  const merged = existingItems ? existingItems.slice(0) : [];
  const itemsToId = {};
  existingItems.forEach((item, index) => {
    itemsToId[readField('id', item)] = index;
  });

  incoming.forEach(item => {
    const id = readField('id', item);
    const index = itemsToId[id];
    if (typeof index === 'number') {
      merged[index] = mergeObjects(merged[index], item);
    } else {
      itemsToId[id] = merged.length;
      merged.push(item);
    }
  });

  return merged;
};

const buildSortingKey = variables => {
  const { sort, limit } = variables?.pagination || {};
  if (sort || limit) {
    return `s:${sort?.by}:${sort?.order}:l:${limit}`;
  }
};

export const mergeReadObjectByPagination = (keys: string[] = []) => {
  return {
    // eslint-disable-next-line
    keyArgs: variables => {
      const { input } = variables;
      const sortingKey = buildSortingKey(variables);

      const keyItems = keys
        .filter(key => key && input && input[key])
        .map(key => `${key}:${input[key]}`)
        .join(':');

      if (keyItems) {
        if (sortingKey) {
          return `k:${keyItems}:${sortingKey}`;
        }

        return `k:${keyItems}`;
      }

      if (sortingKey) {
        return `k:${sortingKey}`;
      }

      return 'all';
    },
    read(existing) {
      if (existing) {
        return existing;
      }
    },
    merge(existing, incoming, { mergeObjects, readField, args }) {
      if (args.pagination && !args.pagination.next) {
        return incoming;
      }

      const merged = mergeUnique(existing?.items, incoming.items, { mergeObjects, readField });      

      return {
        __typename: incoming.__typename,
        pageInfo: incoming.pageInfo,
        items: merged,
      };
    },
  };
};