import Marquee from 'react-fast-marquee';
type InfiniteScrollProps<T extends { id: string | number }> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
};

function InfiniteScroll<T extends { id: string | number }>(props: InfiniteScrollProps<T>) {
  const { renderItem, items } = props;

  return (
    <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
      <Marquee direction="left" pauseOnHover autoFill>
        {items.map((item, index) => (
          <li className="list-none" key={index}>
            {renderItem(item)}
          </li>
        ))}
      </Marquee>
    </div>
  );
}

export default InfiniteScroll;
