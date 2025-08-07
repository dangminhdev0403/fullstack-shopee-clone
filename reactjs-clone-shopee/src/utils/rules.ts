type Rules = {
  required: (fieldName: string) => object;
  mustEmail: () => object;
};

export const rules: Rules = {
  required: (fieldName: string) => {
    return {
      required: `Vui lòng nhập ${fieldName} `,
    };
  },

  mustEmail: () => {
    return {
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Trường này phải là Email",
      },
    };
  },
};
