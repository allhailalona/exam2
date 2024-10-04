export type CategoryRow = {
  category_name: string;
};

export type TenantRow = {
  first_name: string;
  last_name: string;
};

export type Options = {
  categories: CategoryRow[]; 
  tenants: TenantRow[];
};
