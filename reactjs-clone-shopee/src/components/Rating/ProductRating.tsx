import { Box, Rating } from "@mui/material";

interface ProductRatingProps {
  value: number;
}

const ProductRating = ({ value }: ProductRatingProps) => {
  return (
    <div>
      <Box className="flex items-center justify-center gap-2">
        <span className="border-b text-2xl text-gray-900">{value}</span>
        <Rating
          name="read-only"
          value={value}
          precision={0.5}
          readOnly
          size="small"
        />
      </Box>
    </div>
  );
};

export default ProductRating;
