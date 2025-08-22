import { EmployeeDetailsSelectModel } from "../Employee/employee-details-select-model";
import { TechnologyDetails } from "../Technology/technology-details";

export interface AddEditProjectDialogData {
  Id: number,
  technologiesList: TechnologyDetails[];
  selectEmployeeList: EmployeeDetailsSelectModel[];
}