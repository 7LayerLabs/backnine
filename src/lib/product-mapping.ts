// Product Mapping: BackNine Website → Printify/Printful
// This maps website product IDs + color/size to fulfillment provider variant IDs

export type FulfillmentProvider = 'printify' | 'printful' | 'none';

export interface ProductMapping {
  websiteProductId: string;
  provider: FulfillmentProvider;
  printifyProductId?: string;
  printfulProductId?: number;
  variants: VariantMapping[];
}

export interface VariantMapping {
  color: string;
  size?: string;
  printifyVariantId?: number;
  printfulSyncVariantId?: number;
  printfulSku?: string; // For products identified by SKU
}

// =============================================================================
// PRINTFUL PRODUCTS (Headwear)
// =============================================================================

const beanieMapping: ProductMapping = {
  websiteProductId: 'beanie',
  provider: 'printful',
  printfulProductId: 406890559,
  variants: [
    { color: 'Black', printfulSyncVariantId: 5100563921 },
    { color: 'Royal Heather', printfulSyncVariantId: 5100563922 },
    { color: 'Heather Black', printfulSyncVariantId: 5100563923 },
    { color: 'Heather Grey', printfulSyncVariantId: 5100563924 },
  ],
};

// Classic Rope Hat - Printful (using SKUs to identify each design)
const ropeCapMapping: ProductMapping = {
  websiteProductId: 'rope-cap-white-green',
  provider: 'printful',
  printfulProductId: 0, // Multiple products, use SKU to identify
  variants: [
    { color: 'White/Green', printfulSku: '693df55ba3e9a1' },
    { color: 'White/Blue', printfulSku: '693df5ad26e1d4' },
    { color: 'Navy/Blue', printfulSku: '693df5f3c32ac9' },
    { color: 'Black/Teal', printfulSku: '693df586aaf016' },
    { color: 'Black/Gold', printfulSku: '693df53bee5603' },
    { color: 'Navy/Sunset', printfulSku: '693df4ff59a748' },
  ],
};

// =============================================================================
// PRINTIFY PRODUCTS (Apparel & Accessories)
// =============================================================================

// Golfer Logo Hoodie - Printify Product ID: 6923923f08e6c6f1f2006b1b
const hoodieMapping: ProductMapping = {
  websiteProductId: 'classic-hoodie',
  provider: 'printify',
  printifyProductId: '6923923f08e6c6f1f2006b1b',
  variants: [
    // Sport Grey
    { color: 'Sport Grey', size: 'S', printifyVariantId: 32902 },
    { color: 'Sport Grey', size: 'M', printifyVariantId: 32903 },
    { color: 'Sport Grey', size: 'L', printifyVariantId: 32904 },
    { color: 'Sport Grey', size: 'XL', printifyVariantId: 32905 },
    { color: 'Sport Grey', size: '2XL', printifyVariantId: 32906 },
    { color: 'Sport Grey', size: '3XL', printifyVariantId: 32907 },
    { color: 'Sport Grey', size: '4XL', printifyVariantId: 32908 },
    { color: 'Sport Grey', size: '5XL', printifyVariantId: 32909 },
    // White
    { color: 'White', size: 'S', printifyVariantId: 32910 },
    { color: 'White', size: 'M', printifyVariantId: 32911 },
    { color: 'White', size: 'L', printifyVariantId: 32912 },
    { color: 'White', size: 'XL', printifyVariantId: 32913 },
    { color: 'White', size: '2XL', printifyVariantId: 32914 },
    // Light Blue
    { color: 'Light Blue', size: 'S', printifyVariantId: 42235 },
    { color: 'Light Blue', size: 'M', printifyVariantId: 42236 },
    { color: 'Light Blue', size: 'L', printifyVariantId: 42237 },
    { color: 'Light Blue', size: 'XL', printifyVariantId: 42238 },
    { color: 'Light Blue', size: '2XL', printifyVariantId: 42239 },
    // Light Pink
    { color: 'Light Pink', size: 'S', printifyVariantId: 42148 },
    { color: 'Light Pink', size: 'M', printifyVariantId: 42149 },
    { color: 'Light Pink', size: 'L', printifyVariantId: 42150 },
    { color: 'Light Pink', size: 'XL', printifyVariantId: 42151 },
    { color: 'Light Pink', size: '2XL', printifyVariantId: 42152 },
    // Sand
    { color: 'Sand', size: 'S', printifyVariantId: 42164 },
    { color: 'Sand', size: 'M', printifyVariantId: 42165 },
    { color: 'Sand', size: 'L', printifyVariantId: 42166 },
    { color: 'Sand', size: 'XL', printifyVariantId: 42167 },
    { color: 'Sand', size: '2XL', printifyVariantId: 42168 },
    { color: 'Sand', size: '3XL', printifyVariantId: 42169 },
    // Dark Heather
    { color: 'Dark Heather', size: 'S', printifyVariantId: 32878 },
    { color: 'Dark Heather', size: 'M', printifyVariantId: 32879 },
    { color: 'Dark Heather', size: 'L', printifyVariantId: 32880 },
    { color: 'Dark Heather', size: 'XL', printifyVariantId: 32881 },
    { color: 'Dark Heather', size: '2XL', printifyVariantId: 32882 },
    // Maroon
    { color: 'Maroon', size: 'S', printifyVariantId: 32886 },
    { color: 'Maroon', size: 'M', printifyVariantId: 32887 },
    { color: 'Maroon', size: 'L', printifyVariantId: 32888 },
    { color: 'Maroon', size: 'XL', printifyVariantId: 32889 },
    { color: 'Maroon', size: '2XL', printifyVariantId: 32890 },
    // Red
    { color: 'Red', size: 'S', printifyVariantId: 33385 },
    { color: 'Red', size: 'M', printifyVariantId: 33386 },
    { color: 'Red', size: 'L', printifyVariantId: 33387 },
    { color: 'Red', size: 'XL', printifyVariantId: 33388 },
    { color: 'Red', size: '2XL', printifyVariantId: 33389 },
    { color: 'Red', size: '3XL', printifyVariantId: 33390 },
    // Royal Blue (Royal in Printify)
    { color: 'Royal Blue', size: 'S', printifyVariantId: 33393 },
    { color: 'Royal Blue', size: 'M', printifyVariantId: 33394 },
    { color: 'Royal Blue', size: 'L', printifyVariantId: 33395 },
    { color: 'Royal Blue', size: 'XL', printifyVariantId: 33396 },
    { color: 'Royal Blue', size: '2XL', printifyVariantId: 33397 },
    { color: 'Royal Blue', size: '3XL', printifyVariantId: 33398 },
  ],
};

// Golf Player Sweatshirt - Printify Product ID: 69228ffe1aa437980803f031
const sweatshirtMapping: ProductMapping = {
  websiteProductId: 'crewneck-sweatshirt',
  provider: 'printify',
  printifyProductId: '69228ffe1aa437980803f031',
  variants: [
    // Grey
    { color: 'Grey', size: 'S', printifyVariantId: 96874 },
    { color: 'Grey', size: 'M', printifyVariantId: 96875 },
    { color: 'Grey', size: 'L', printifyVariantId: 96876 },
    { color: 'Grey', size: 'XL', printifyVariantId: 96877 },
    { color: 'Grey', size: '2XL', printifyVariantId: 96878 },
    { color: 'Grey', size: '3XL', printifyVariantId: 102367 },
    // White
    { color: 'White', size: 'S', printifyVariantId: 96919 },
    { color: 'White', size: 'M', printifyVariantId: 96920 },
    { color: 'White', size: 'L', printifyVariantId: 96921 },
    { color: 'White', size: 'XL', printifyVariantId: 96922 },
    { color: 'White', size: '2XL', printifyVariantId: 96923 },
    { color: 'White', size: '3XL', printifyVariantId: 102376 },
    // Bay (Light Green in Printify)
    { color: 'Bay', size: 'S', printifyVariantId: 96884 },
    { color: 'Bay', size: 'M', printifyVariantId: 96885 },
    { color: 'Bay', size: 'L', printifyVariantId: 96886 },
    { color: 'Bay', size: 'XL', printifyVariantId: 96887 },
    { color: 'Bay', size: '2XL', printifyVariantId: 96888 },
    { color: 'Bay', size: '3XL', printifyVariantId: 102369 },
    // Blue Jean
    { color: 'Blue Jean', size: 'S', printifyVariantId: 96834 },
    { color: 'Blue Jean', size: 'M', printifyVariantId: 96835 },
    { color: 'Blue Jean', size: 'L', printifyVariantId: 96836 },
    { color: 'Blue Jean', size: 'XL', printifyVariantId: 96837 },
    { color: 'Blue Jean', size: '2XL', printifyVariantId: 96838 },
    { color: 'Blue Jean', size: '3XL', printifyVariantId: 102359 },
    // Blue Spruce
    { color: 'Blue Spruce', size: 'S', printifyVariantId: 96839 },
    { color: 'Blue Spruce', size: 'M', printifyVariantId: 96840 },
    { color: 'Blue Spruce', size: 'L', printifyVariantId: 96841 },
    { color: 'Blue Spruce', size: 'XL', printifyVariantId: 96842 },
    { color: 'Blue Spruce', size: '2XL', printifyVariantId: 96843 },
    { color: 'Blue Spruce', size: '3XL', printifyVariantId: 102360 },
    // Butter Yellow (Butter in Printify)
    { color: 'Butter Yellow', size: 'S', printifyVariantId: 96844 },
    { color: 'Butter Yellow', size: 'M', printifyVariantId: 96845 },
    { color: 'Butter Yellow', size: 'L', printifyVariantId: 96846 },
    { color: 'Butter Yellow', size: 'XL', printifyVariantId: 96847 },
    { color: 'Butter Yellow', size: '2XL', printifyVariantId: 96848 },
    { color: 'Butter Yellow', size: '3XL', printifyVariantId: 102361 },
    // Chalky Mint
    { color: 'Chalky Mint', size: 'S', printifyVariantId: 96849 },
    { color: 'Chalky Mint', size: 'M', printifyVariantId: 96850 },
    { color: 'Chalky Mint', size: 'L', printifyVariantId: 96851 },
    { color: 'Chalky Mint', size: 'XL', printifyVariantId: 96852 },
    { color: 'Chalky Mint', size: '2XL', printifyVariantId: 96853 },
    { color: 'Chalky Mint', size: '3XL', printifyVariantId: 102362 },
    // Light Blue (Chambray in Printify)
    { color: 'Light Blue', size: 'S', printifyVariantId: 96854 },
    { color: 'Light Blue', size: 'M', printifyVariantId: 96855 },
    { color: 'Light Blue', size: 'L', printifyVariantId: 96856 },
    { color: 'Light Blue', size: 'XL', printifyVariantId: 96857 },
    { color: 'Light Blue', size: '2XL', printifyVariantId: 96858 },
    { color: 'Light Blue', size: '3XL', printifyVariantId: 102363 },
    // Peachy (Terracotta in Printify)
    { color: 'Peachy', size: 'S', printifyVariantId: 102427 },
    { color: 'Peachy', size: 'M', printifyVariantId: 102428 },
    { color: 'Peachy', size: 'L', printifyVariantId: 102429 },
    { color: 'Peachy', size: 'XL', printifyVariantId: 102430 },
    { color: 'Peachy', size: '2XL', printifyVariantId: 102431 },
    { color: 'Peachy', size: '3XL', printifyVariantId: 102432 },
    // Pepper Charcoal (Pepper in Printify)
    { color: 'Pepper Charcoal', size: 'S', printifyVariantId: 96894 },
    { color: 'Pepper Charcoal', size: 'M', printifyVariantId: 96895 },
    { color: 'Pepper Charcoal', size: 'L', printifyVariantId: 96896 },
    { color: 'Pepper Charcoal', size: 'XL', printifyVariantId: 96897 },
    { color: 'Pepper Charcoal', size: '2XL', printifyVariantId: 96898 },
    { color: 'Pepper Charcoal', size: '3XL', printifyVariantId: 102371 },
    // Seafoam
    { color: 'Seafoam', size: 'S', printifyVariantId: 96899 },
    { color: 'Seafoam', size: 'M', printifyVariantId: 96900 },
    { color: 'Seafoam', size: 'L', printifyVariantId: 96901 },
    { color: 'Seafoam', size: 'XL', printifyVariantId: 96902 },
    { color: 'Seafoam', size: '2XL', printifyVariantId: 96903 },
    { color: 'Seafoam', size: '3XL', printifyVariantId: 102372 },
  ],
};

// Logo T-Shirt - Printify Product ID: 692393452d5477b63008aeab
const tshirtMapping: ProductMapping = {
  websiteProductId: 'classic-tee',
  provider: 'printify',
  printifyProductId: '692393452d5477b63008aeab',
  variants: [
    // White
    { color: 'White', size: 'S', printifyVariantId: 73199 },
    { color: 'White', size: 'M', printifyVariantId: 73203 },
    { color: 'White', size: 'L', printifyVariantId: 73207 },
    { color: 'White', size: 'XL', printifyVariantId: 73211 },
    { color: 'White', size: '2XL', printifyVariantId: 73215 },
    { color: 'White', size: '3XL', printifyVariantId: 79169 },
    { color: 'White', size: '4XL', printifyVariantId: 101476 },
    // Ivory
    { color: 'Ivory', size: 'S', printifyVariantId: 78991 },
    { color: 'Ivory', size: 'M', printifyVariantId: 78992 },
    { color: 'Ivory', size: 'L', printifyVariantId: 78993 },
    { color: 'Ivory', size: 'XL', printifyVariantId: 78994 },
    { color: 'Ivory', size: '2XL', printifyVariantId: 78995 },
    { color: 'Ivory', size: '3XL', printifyVariantId: 79142 },
    { color: 'Ivory', size: '4XL', printifyVariantId: 101450 },
    // Butter
    { color: 'Butter', size: 'S', printifyVariantId: 78866 },
    { color: 'Butter', size: 'M', printifyVariantId: 78867 },
    { color: 'Butter', size: 'L', printifyVariantId: 78868 },
    { color: 'Butter', size: 'XL', printifyVariantId: 78869 },
    { color: 'Butter', size: '2XL', printifyVariantId: 78870 },
    { color: 'Butter', size: '3XL', printifyVariantId: 79122 },
    { color: 'Butter', size: '4XL', printifyVariantId: 101431 },
    // Blue Jean
    { color: 'Blue Jean', size: 'S', printifyVariantId: 78921 },
    { color: 'Blue Jean', size: 'M', printifyVariantId: 78922 },
    { color: 'Blue Jean', size: 'L', printifyVariantId: 78923 },
    { color: 'Blue Jean', size: 'XL', printifyVariantId: 78924 },
    { color: 'Blue Jean', size: '2XL', printifyVariantId: 78925 },
    { color: 'Blue Jean', size: '3XL', printifyVariantId: 79124 },
    // Chambray
    { color: 'Chambray', size: 'S', printifyVariantId: 78921 },
    { color: 'Chambray', size: 'M', printifyVariantId: 78922 },
    { color: 'Chambray', size: 'L', printifyVariantId: 78923 },
    { color: 'Chambray', size: 'XL', printifyVariantId: 78924 },
    { color: 'Chambray', size: '2XL', printifyVariantId: 78925 },
    { color: 'Chambray', size: '3XL', printifyVariantId: 79124 },
    { color: 'Chambray', size: '4XL', printifyVariantId: 101433 },
    // Flo Blue (Ice Blue in Printify)
    { color: 'Flo Blue', size: 'S', printifyVariantId: 78986 },
    { color: 'Flo Blue', size: 'M', printifyVariantId: 78987 },
    { color: 'Flo Blue', size: 'L', printifyVariantId: 78988 },
    { color: 'Flo Blue', size: 'XL', printifyVariantId: 78989 },
    { color: 'Flo Blue', size: '2XL', printifyVariantId: 78990 },
    { color: 'Flo Blue', size: '3XL', printifyVariantId: 79140 },
    { color: 'Flo Blue', size: '4XL', printifyVariantId: 101448 },
    // Island Reef
    { color: 'Island Reef', size: 'S', printifyVariantId: 73969 },
    { color: 'Island Reef', size: 'M', printifyVariantId: 73976 },
    { color: 'Island Reef', size: 'L', printifyVariantId: 73983 },
    { color: 'Island Reef', size: 'XL', printifyVariantId: 73990 },
    { color: 'Island Reef', size: '2XL', printifyVariantId: 73997 },
    { color: 'Island Reef', size: '3XL', printifyVariantId: 79141 },
    { color: 'Island Reef', size: '4XL', printifyVariantId: 101449 },
    // Moss (Sage in Printify)
    { color: 'Moss', size: 'S', printifyVariantId: 79061 },
    { color: 'Moss', size: 'M', printifyVariantId: 79062 },
    { color: 'Moss', size: 'L', printifyVariantId: 79063 },
    { color: 'Moss', size: 'XL', printifyVariantId: 79064 },
    { color: 'Moss', size: '2XL', printifyVariantId: 79065 },
    { color: 'Moss', size: '3XL', printifyVariantId: 79159 },
    { color: 'Moss', size: '4XL', printifyVariantId: 101467 },
    // Khaki
    { color: 'Khaki', size: 'S', printifyVariantId: 78996 },
    { color: 'Khaki', size: 'M', printifyVariantId: 78997 },
    { color: 'Khaki', size: 'L', printifyVariantId: 78998 },
    { color: 'Khaki', size: 'XL', printifyVariantId: 78999 },
    { color: 'Khaki', size: '2XL', printifyVariantId: 79000 },
    { color: 'Khaki', size: '3XL', printifyVariantId: 79143 },
    { color: 'Khaki', size: '4XL', printifyVariantId: 101451 },
    // Brick
    { color: 'Brick', size: 'S', printifyVariantId: 78901 },
    { color: 'Brick', size: 'M', printifyVariantId: 78902 },
    { color: 'Brick', size: 'L', printifyVariantId: 78903 },
    { color: 'Brick', size: 'XL', printifyVariantId: 78904 },
    { color: 'Brick', size: '2XL', printifyVariantId: 78905 },
    { color: 'Brick', size: '3XL', printifyVariantId: 79119 },
    { color: 'Brick', size: '4XL', printifyVariantId: 101428 },
    // Crimson (Chili in Printify)
    { color: 'Crimson', size: 'S', printifyVariantId: 78926 },
    { color: 'Crimson', size: 'M', printifyVariantId: 78927 },
    { color: 'Crimson', size: 'L', printifyVariantId: 78928 },
    { color: 'Crimson', size: 'XL', printifyVariantId: 78929 },
    { color: 'Crimson', size: '2XL', printifyVariantId: 78930 },
    { color: 'Crimson', size: '3XL', printifyVariantId: 79125 },
    { color: 'Crimson', size: '4XL', printifyVariantId: 101434 },
    // Red
    { color: 'Red', size: 'S', printifyVariantId: 73198 },
    { color: 'Red', size: 'M', printifyVariantId: 73202 },
    { color: 'Red', size: 'L', printifyVariantId: 73206 },
    { color: 'Red', size: 'XL', printifyVariantId: 73210 },
    { color: 'Red', size: '2XL', printifyVariantId: 73214 },
    { color: 'Red', size: '3XL', printifyVariantId: 79157 },
    { color: 'Red', size: '4XL', printifyVariantId: 101465 },
    // Graphite
    { color: 'Graphite', size: 'S', printifyVariantId: 78961 },
    { color: 'Graphite', size: 'M', printifyVariantId: 78962 },
    { color: 'Graphite', size: 'L', printifyVariantId: 78963 },
    { color: 'Graphite', size: 'XL', printifyVariantId: 78964 },
    { color: 'Graphite', size: '2XL', printifyVariantId: 78965 },
    { color: 'Graphite', size: '3XL', printifyVariantId: 79135 },
    { color: 'Graphite', size: '4XL', printifyVariantId: 101443 },
    // Pepper
    { color: 'Pepper', size: 'S', printifyVariantId: 79046 },
    { color: 'Pepper', size: 'M', printifyVariantId: 79047 },
    { color: 'Pepper', size: 'L', printifyVariantId: 79048 },
    { color: 'Pepper', size: 'XL', printifyVariantId: 79049 },
    { color: 'Pepper', size: '2XL', printifyVariantId: 79050 },
    { color: 'Pepper', size: '3XL', printifyVariantId: 79155 },
    { color: 'Pepper', size: '4XL', printifyVariantId: 101463 },
    // Espresso
    { color: 'Espresso', size: 'S', printifyVariantId: 102352 },
    { color: 'Espresso', size: 'M', printifyVariantId: 102353 },
    { color: 'Espresso', size: 'L', printifyVariantId: 102354 },
    { color: 'Espresso', size: 'XL', printifyVariantId: 102355 },
    { color: 'Espresso', size: '2XL', printifyVariantId: 102356 },
    { color: 'Espresso', size: '3XL', printifyVariantId: 102357 },
    { color: 'Espresso', size: '4XL', printifyVariantId: 102358 },
  ],
};

// Performance Polo - Printify Product ID: 6922955d41fdfd3de107f8f4
// NOTE: Only 3 colors enabled in Printify (Iron Grey, Silver, White) - website shows 13
const poloMapping: ProductMapping = {
  websiteProductId: 'polo',
  provider: 'printify',
  printifyProductId: '6922955d41fdfd3de107f8f4',
  variants: [
    // White
    { color: 'White', size: 'XS', printifyVariantId: 121708 },
    { color: 'White', size: 'S', printifyVariantId: 121680 },
    { color: 'White', size: 'M', printifyVariantId: 121666 },
    { color: 'White', size: 'L', printifyVariantId: 121652 },
    { color: 'White', size: 'XL', printifyVariantId: 121694 },
    { color: 'White', size: '2XL', printifyVariantId: 121610 },
    { color: 'White', size: '3XL', printifyVariantId: 121624 },
    { color: 'White', size: '4XL', printifyVariantId: 121638 },
    // Grey (maps to Iron Grey in Printify)
    { color: 'Grey', size: 'XS', printifyVariantId: 121701 },
    { color: 'Grey', size: 'S', printifyVariantId: 121673 },
    { color: 'Grey', size: 'M', printifyVariantId: 121659 },
    { color: 'Grey', size: 'L', printifyVariantId: 121645 },
    { color: 'Grey', size: 'XL', printifyVariantId: 121687 },
    { color: 'Grey', size: '2XL', printifyVariantId: 121603 },
    { color: 'Grey', size: '3XL', printifyVariantId: 121617 },
    { color: 'Grey', size: '4XL', printifyVariantId: 121631 },
    // Light Blue (maps to Silver in Printify - closest match)
    { color: 'Light Blue', size: 'XS', printifyVariantId: 121705 },
    { color: 'Light Blue', size: 'S', printifyVariantId: 121677 },
    { color: 'Light Blue', size: 'M', printifyVariantId: 121663 },
    { color: 'Light Blue', size: 'L', printifyVariantId: 121649 },
    { color: 'Light Blue', size: 'XL', printifyVariantId: 121691 },
    { color: 'Light Blue', size: '2XL', printifyVariantId: 121607 },
    { color: 'Light Blue', size: '3XL', printifyVariantId: 121621 },
    { color: 'Light Blue', size: '4XL', printifyVariantId: 121635 },
  ],
};

// Quarter Zip Pullover - Printify Product ID: 69252d69a40ed40385040c30
// Website shows: Charcoal, White - Printify has Charcoal Grey but no White enabled
const quarterZipMapping: ProductMapping = {
  websiteProductId: 'quarter-zip',
  provider: 'printify',
  printifyProductId: '69252d69a40ed40385040c30',
  variants: [
    // Charcoal (maps to Charcoal Grey in Printify)
    { color: 'Charcoal', size: 'XS', printifyVariantId: 123809 },
    { color: 'Charcoal', size: 'S', printifyVariantId: 123807 },
    { color: 'Charcoal', size: 'M', printifyVariantId: 123806 },
    { color: 'Charcoal', size: 'L', printifyVariantId: 123805 },
    { color: 'Charcoal', size: 'XL', printifyVariantId: 123808 },
    { color: 'Charcoal', size: '2XL', printifyVariantId: 123802 },
    { color: 'Charcoal', size: '3XL', printifyVariantId: 123803 },
    { color: 'Charcoal', size: '4XL', printifyVariantId: 123804 },
    // White - NOT ENABLED in Printify, using Black as fallback
    { color: 'White', size: 'XS', printifyVariantId: 123792 },
    { color: 'White', size: 'S', printifyVariantId: 123772 },
    { color: 'White', size: 'M', printifyVariantId: 123762 },
    { color: 'White', size: 'L', printifyVariantId: 123752 },
    { color: 'White', size: 'XL', printifyVariantId: 123782 },
    { color: 'White', size: '2XL', printifyVariantId: 123722 },
    { color: 'White', size: '3XL', printifyVariantId: 123732 },
    { color: 'White', size: '4XL', printifyVariantId: 123742 },
  ],
};

// Pullover - Printify Product ID: 69252d69a40ed40385040c30 (same as quarter-zip)
// Website shows: Charcoal, Slate Grey, Black, Carolina Blue, Royal Blue, Forest Green, Maroon, Red
const pulloverMapping: ProductMapping = {
  websiteProductId: 'pullover',
  provider: 'printify',
  printifyProductId: '69252d69a40ed40385040c30',
  variants: [
    // Charcoal (maps to Charcoal Grey)
    { color: 'Charcoal', size: 'XS', printifyVariantId: 123809 },
    { color: 'Charcoal', size: 'S', printifyVariantId: 123807 },
    { color: 'Charcoal', size: 'M', printifyVariantId: 123806 },
    { color: 'Charcoal', size: 'L', printifyVariantId: 123805 },
    { color: 'Charcoal', size: 'XL', printifyVariantId: 123808 },
    { color: 'Charcoal', size: '2XL', printifyVariantId: 123802 },
    { color: 'Charcoal', size: '3XL', printifyVariantId: 123803 },
    { color: 'Charcoal', size: '4XL', printifyVariantId: 123804 },
    // Black
    { color: 'Black', size: 'XS', printifyVariantId: 123792 },
    { color: 'Black', size: 'S', printifyVariantId: 123772 },
    { color: 'Black', size: 'M', printifyVariantId: 123762 },
    { color: 'Black', size: 'L', printifyVariantId: 123752 },
    { color: 'Black', size: 'XL', printifyVariantId: 123782 },
    { color: 'Black', size: '2XL', printifyVariantId: 123722 },
    { color: 'Black', size: '3XL', printifyVariantId: 123732 },
    { color: 'Black', size: '4XL', printifyVariantId: 123742 },
    // Royal Blue (maps to True Royal)
    { color: 'Royal Blue', size: 'XS', printifyVariantId: 123799 },
    { color: 'Royal Blue', size: 'S', printifyVariantId: 123779 },
    { color: 'Royal Blue', size: 'M', printifyVariantId: 123769 },
    { color: 'Royal Blue', size: 'L', printifyVariantId: 123759 },
    { color: 'Royal Blue', size: 'XL', printifyVariantId: 123789 },
    { color: 'Royal Blue', size: '2XL', printifyVariantId: 123729 },
    { color: 'Royal Blue', size: '3XL', printifyVariantId: 123739 },
    { color: 'Royal Blue', size: '4XL', printifyVariantId: 123749 },
    // Forest Green
    { color: 'Forest Green', size: 'XS', printifyVariantId: 123794 },
    { color: 'Forest Green', size: 'S', printifyVariantId: 123774 },
    { color: 'Forest Green', size: 'M', printifyVariantId: 123764 },
    { color: 'Forest Green', size: 'L', printifyVariantId: 123754 },
    { color: 'Forest Green', size: 'XL', printifyVariantId: 123784 },
    { color: 'Forest Green', size: '2XL', printifyVariantId: 123724 },
    { color: 'Forest Green', size: '3XL', printifyVariantId: 123734 },
    { color: 'Forest Green', size: '4XL', printifyVariantId: 123744 },
    // Maroon
    { color: 'Maroon', size: 'XS', printifyVariantId: 123795 },
    { color: 'Maroon', size: 'S', printifyVariantId: 123775 },
    { color: 'Maroon', size: 'M', printifyVariantId: 123765 },
    { color: 'Maroon', size: 'L', printifyVariantId: 123755 },
    { color: 'Maroon', size: 'XL', printifyVariantId: 123785 },
    { color: 'Maroon', size: '2XL', printifyVariantId: 123725 },
    { color: 'Maroon', size: '3XL', printifyVariantId: 123735 },
    { color: 'Maroon', size: '4XL', printifyVariantId: 123745 },
    // Red (maps to True Red)
    { color: 'Red', size: 'XS', printifyVariantId: 123798 },
    { color: 'Red', size: 'S', printifyVariantId: 123778 },
    { color: 'Red', size: 'M', printifyVariantId: 123768 },
    { color: 'Red', size: 'L', printifyVariantId: 123758 },
    { color: 'Red', size: 'XL', printifyVariantId: 123788 },
    { color: 'Red', size: '2XL', printifyVariantId: 123728 },
    { color: 'Red', size: '3XL', printifyVariantId: 123738 },
    { color: 'Red', size: '4XL', printifyVariantId: 123748 },
  ],
};

// Par-Tee Time Hoodie - Printful (Unisex garment-dyed lightweight hoodie)
const parTeeHoodieMapping: ProductMapping = {
  websiteProductId: 'par-tee-hoodie',
  provider: 'printful',
  printfulProductId: 407474959,
  variants: [
    // Peachy
    { color: 'Peachy', size: 'S', printfulSyncVariantId: 5106603489 },
    { color: 'Peachy', size: 'M', printfulSyncVariantId: 5106603490 },
    { color: 'Peachy', size: 'L', printfulSyncVariantId: 5106603491 },
    { color: 'Peachy', size: 'XL', printfulSyncVariantId: 5106603492 },
    { color: 'Peachy', size: '2XL', printfulSyncVariantId: 5106603493 },
    { color: 'Peachy', size: '3XL', printfulSyncVariantId: 5106603494 },
    // Hydrangea
    { color: 'Hydrangea', size: 'S', printfulSyncVariantId: 5106603495 },
    { color: 'Hydrangea', size: 'M', printfulSyncVariantId: 5106603497 },
    { color: 'Hydrangea', size: 'L', printfulSyncVariantId: 5106603498 },
    { color: 'Hydrangea', size: 'XL', printfulSyncVariantId: 5106603499 },
    { color: 'Hydrangea', size: '2XL', printfulSyncVariantId: 5106603500 },
    { color: 'Hydrangea', size: '3XL', printfulSyncVariantId: 5106603501 },
    // Ivory
    { color: 'Ivory', size: 'S', printfulSyncVariantId: 5106603502 },
    { color: 'Ivory', size: 'M', printfulSyncVariantId: 5106603503 },
    { color: 'Ivory', size: 'L', printfulSyncVariantId: 5106603504 },
    { color: 'Ivory', size: 'XL', printfulSyncVariantId: 5106603505 },
    { color: 'Ivory', size: '2XL', printfulSyncVariantId: 5106603506 },
    { color: 'Ivory', size: '3XL', printfulSyncVariantId: 5106603507 },
    // White
    { color: 'White', size: 'S', printfulSyncVariantId: 5106603509 },
    { color: 'White', size: 'M', printfulSyncVariantId: 5106603510 },
    { color: 'White', size: 'L', printfulSyncVariantId: 5106603511 },
    { color: 'White', size: 'XL', printfulSyncVariantId: 5106603512 },
    { color: 'White', size: '2XL', printfulSyncVariantId: 5106603513 },
    { color: 'White', size: '3XL', printfulSyncVariantId: 5106603514 },
  ],
};

// Golf Towel - Printify Product ID: 69228a2a7d60726e940f13d0
const golfTowelMapping: ProductMapping = {
  websiteProductId: 'golf-towel',
  provider: 'printify',
  printifyProductId: '69228a2a7d60726e940f13d0',
  variants: [
    { color: 'Default', size: '16\'\' x 24\'\'', printifyVariantId: 112488 },
  ],
};

// Digital products - no fulfillment needed
const rockyRoastMapping: ProductMapping = {
  websiteProductId: 'rocky-roast',
  provider: 'none',
  variants: [],
};

// =============================================================================
// PRODUCT MAPPING LOOKUP
// =============================================================================

export const productMappings: ProductMapping[] = [
  // Printful (Headwear)
  beanieMapping,
  ropeCapMapping,
  parTeeHoodieMapping,
  // Printify (Apparel)
  hoodieMapping,
  sweatshirtMapping,
  tshirtMapping,
  poloMapping,
  quarterZipMapping,
  pulloverMapping,
  golfTowelMapping,
  // Digital (No fulfillment)
  rockyRoastMapping,
];

export function getProductMapping(websiteProductId: string): ProductMapping | undefined {
  return productMappings.find(p => p.websiteProductId === websiteProductId);
}

export function getVariantId(
  websiteProductId: string,
  color: string,
  size?: string
): { provider: FulfillmentProvider; variantId: number; productId: string | number; sku?: string } | null {
  const mapping = getProductMapping(websiteProductId);

  if (!mapping || mapping.provider === 'none') {
    return null;
  }

  const variant = mapping.variants.find(v => {
    const colorMatch = v.color.toLowerCase() === color.toLowerCase();
    const sizeMatch = !size || !v.size || v.size.toLowerCase() === size.toLowerCase();
    return colorMatch && sizeMatch;
  });

  if (!variant) {
    console.warn(`No variant found for ${websiteProductId} - ${color} - ${size}`);
    return null;
  }

  if (mapping.provider === 'printful') {
    return {
      provider: 'printful',
      variantId: variant.printfulSyncVariantId || 0,
      productId: mapping.printfulProductId || 0,
      sku: variant.printfulSku,
    };
  }

  if (mapping.provider === 'printify') {
    return {
      provider: 'printify',
      variantId: variant.printifyVariantId || 0,
      productId: mapping.printifyProductId || '',
    };
  }

  return null;
}

export function getProviderForCategory(category: string): FulfillmentProvider {
  if (category === 'headwear') {
    return 'printful';
  }
  if (category === 'tops' || category === 'accessories') {
    return 'printify';
  }
  if (category === 'digital') {
    return 'none';
  }
  return 'none';
}
