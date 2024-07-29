export type diffType = {
  diff: string;
  new_path: string;
  old_path: string;
  a_mode: any;
  b_mode: string;
  new_file: boolean;
  renamed_file: boolean;
  deleted_file: boolean;
  generated_file: any;
};
