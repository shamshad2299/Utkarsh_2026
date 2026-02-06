import {
  Target,
  Sparkles,
  Trophy,
  Palette,
  BookOpen,
  Utensils,
  Music,
  Users,
  Tag,
  User,
} from 'lucide-react';

// Category name icon mapping
const categoryIconMap = {
  technical: Target,
  cultural: Sparkles,
  sports: Trophy,
  "fine arts": Palette,
  literary: BookOpen,
  "hotel management": Utensils,
  other: Music,
  workshop: Target,
  competition: Trophy,
  seminar: BookOpen,
  concert: Music,
  exhibition: Palette,
  conference: Users,
  festival: Sparkles,
};

// Helper functions
export const getCategoryName = (category) => {
  if (!category) return "Uncategorized";
  if (typeof category === "string") return category;
  if (typeof category === "object") {
    return category.name || category.title || "Uncategorized";
  }
  return "Uncategorized";
};

export const getSubCategory = (subCategory) => {
  if (!subCategory) return null;
  if (typeof subCategory === "string") return subCategory;
  if (typeof subCategory === "object") {
    return subCategory.title || subCategory.name || null;
  }
  return null;
};

export const getImageUrl = (images) => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  }

  const firstImage = images[0];
  if (typeof firstImage === "string") {
    return firstImage;
  }
  if (typeof firstImage === "object") {
    return (
      firstImage.url ||
      firstImage.src ||
      firstImage.imageUrl ||
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    );
  }

  return "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
};

export const getAllImages = (images) => {
  if (!images || !Array.isArray(images)) {
    return [];
  }

  return images
    .map((img) => {
      if (typeof img === "string") return img;
      if (typeof img === "object") {
        return img.url || img.src || img.imageUrl;
      }
      return null;
    })
    .filter(Boolean);
};

export const getCategoryIcon = (categoryName) => {
  if (!categoryName) return Tag;

  const lowerName = categoryName.toLowerCase();

  for (const [key, icon] of Object.entries(categoryIconMap)) {
    if (lowerName === key.toLowerCase()) {
      return icon;
    }
  }

  for (const [key, icon] of Object.entries(categoryIconMap)) {
    if (
      lowerName.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(lowerName)
    ) {
      return icon;
    }
  }

  if (
    lowerName.includes("tech") ||
    lowerName.includes("code") ||
    lowerName.includes("program")
  ) {
    return Target;
  }
  if (
    lowerName.includes("sport") ||
    lowerName.includes("game") ||
    lowerName.includes("athlet")
  ) {
    return Trophy;
  }
  if (
    lowerName.includes("art") ||
    lowerName.includes("design") ||
    lowerName.includes("paint")
  ) {
    return Palette;
  }
  if (
    lowerName.includes("music") ||
    lowerName.includes("dance") ||
    lowerName.includes("perform")
  ) {
    return Music;
  }
  if (
    lowerName.includes("book") ||
    lowerName.includes("write") ||
    lowerName.includes("read")
  ) {
    return BookOpen;
  }
  if (
    lowerName.includes("food") ||
    lowerName.includes("hotel") ||
    lowerName.includes("culinary")
  ) {
    return Utensils;
  }

  return Tag;
};

export const getEventTypeIcon = (eventType) => {
  if (!eventType) return Users;
  const lowerType = eventType.toLowerCase();
  if (lowerType.includes("solo")) return User;
  if (lowerType.includes("team")) return Users;
  return Users;
};

export const getEventTypeText = (teamSize, eventType) => {
  if (eventType?.toLowerCase().includes("solo")) {
    return "SOLO";
  }
  if (eventType?.toLowerCase().includes("team")) {
    return "TEAM";
  }
  if (teamSize?.max === 1 && teamSize?.min === 1) {
    return "SOLO";
  }
  if (teamSize?.max > 1) {
    return "TEAM";
  }
  return "EVENT";
};

export const getEventTypeForFilter = (teamSize, eventType) => {
  if (eventType?.toLowerCase().includes("solo")) {
    return "solo";
  }
  if (eventType?.toLowerCase().includes("team")) {
    return "team";
  }
  if (teamSize?.max === 1 && teamSize?.min === 1) {
    return "solo";
  }
  if (teamSize?.max > 1) {
    return "team";
  }
  return "event";
};

export const formatDate = (dateString) => {
  if (!dateString) return "Date not specified";
  try {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export const formatTime = (dateString) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "";
  }
};

export const getCategoryColor = (categoryName) => {
  if (!categoryName) return "from-purple-500 to-blue-500";

  const lowerName = categoryName.toLowerCase();
  const colorMap = {
    technical: "from-blue-500 to-cyan-500",
    sports: "from-green-500 to-emerald-500",
    cultural: "from-pink-500 to-rose-500",
    "fine arts": "from-purple-500 to-violet-500",
    literary: "from-amber-500 to-yellow-500",
    "hotel management": "from-orange-500 to-red-500",
    other: "from-gray-500 to-slate-500",
  };

  for (const [key, color] of Object.entries(colorMap)) {
    if (lowerName.includes(key.toLowerCase())) {
      return color;
    }
  }

  return "from-purple-500 to-blue-500";
};

export const getTypeFilterColor = (type) => {
  const colorMap = {
    all: "from-purple-500 to-blue-500",
    solo: "from-green-500 to-emerald-500",
    team: "from-orange-500 to-red-500",
  };
  return colorMap[type] || "from-purple-500 to-blue-500";
};