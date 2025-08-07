interface ItemDropCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  onItemClick?: (item: string) => void;
}

const ItemDropCard = ({ ...props }: ItemDropCardProps) => {
  return (
    <button
      className="flex w-full cursor-pointer items-start justify-around gap-2 p-2 hover:bg-gray-100"
      onClick={() => props.onItemClick?.(props.id)}
    >
      <div className="flex items-start">
        <img src={props.imageUrl} alt={props.name} width={50} height={50} />
        <p className="line-clamp-1">{props.name}</p>
      </div>
      <div className="ml-3 flex items-start gap-1 text-sm leading-none text-orange-400">
        <span className="-mb-1 text-sm">đ</span>
        <span>{props?.price.toLocaleString("vi-VN")}</span>
      </div>
    </button>
  );
};

export default ItemDropCard;
