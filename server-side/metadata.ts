import { BLOCK_META_DATA_TABLE_NAME } from "../shared/entities"
import { AddonDataScheme } from "@pepperi-addons/papi-sdk"

export const BlockDataScheme: AddonDataScheme = {
    Name: BLOCK_META_DATA_TABLE_NAME,
    Type: "meta_data",
}