import { RelationType } from "../../models/relation-type.enum";
import { McdTable } from "./mcd-table.class";

export class McdLink {
    constructor(
        public table1: McdTable,
        public table2: McdTable,
        public action: string,
        public relation: RelationType
    ) { }
}