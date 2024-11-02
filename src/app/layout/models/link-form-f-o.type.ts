import { RelationType } from "../../domain/models/relation-type.enum"

export type LinkFormFO = {
    tables: {
        table1: string,
        table2: string
    },
    action: string,
    relationType: RelationType
}