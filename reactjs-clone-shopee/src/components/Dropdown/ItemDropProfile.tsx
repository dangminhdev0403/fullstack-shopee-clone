export interface ItemDropProfileProps {
  name: string;
  value: string;
  onItemClick?: (item: string) => void;
}
const ItemDropProfile = ({ ...props }: ItemDropProfileProps) => {
  return (
    <button
      onMouseLeave={(e) => (e.currentTarget.style.color = "")}
      className="block w-full px-4 py-2 hover:cursor-pointer hover:bg-gray-100 hover:text-amber-500"
      onClick={() => props.onItemClick?.(props.value)}
    >
      {props.name}
    </button>
  );
};

export default ItemDropProfile;
