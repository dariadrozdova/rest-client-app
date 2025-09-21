export const getMethodColor = (method: string): string => {
  const upperMethod = method.toUpperCase();
  switch (upperMethod) {
    case "DELETE": {
      return "text-red-600";
    }
    case "GET": {
      return "text-green-600";
    }
    case "PATCH": {
      return "text-purple-600";
    }
    case "POST": {
      return "text-blue-600";
    }
    case "PUT": {
      return "text-orange-600";
    }
    default: {
      return "text-gray-600";
    }
  }
};
