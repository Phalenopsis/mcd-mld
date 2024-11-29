import { McdLink } from "../models/mcd-link.class";
import { McdNode } from "../models/mcd-node.class";
import { McdTable } from "../models/mcd-table.class";

export class McdNodeFactory {
    createNodesFromTablesAndLinks(tables: McdTable[], links: McdLink[]) {
        const map: Map<McdTable, McdNode> = this.createNodesFromTables(tables);

        for (let link of links) {
            map.get(link.table1)?.addLink(map.get(link.table2) as McdNode);
        }

        return this.#transformMapInArray(map);
    }

    createNodesFromTables(tables: McdTable[]): Map<McdTable, McdNode> {
        const map: Map<McdTable, McdNode> = new Map();
        for (let table of tables) {
            map.set(table, new McdNode(table));
        }
        return map;
    }

    #transformMapInArray(map: Map<McdTable, McdNode>) {
        const list: McdNode[] = [];
        for (let value of map.values()) {
            list.push(value);
        }
        return list;
    }
}