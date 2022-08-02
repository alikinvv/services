const code = {
    service: `import api from 'api'
import { $responseProps } from './$fileName.types'

class $serviceName {
    $request
}

export default new $serviceName()
`,
    serviceIndex: `export {
    default,
    default as $serviceName,
} from './$fileName'
export * from './$fileName.types'
`,
    serviceTypes: `
export interface $type {}
    `,
    store: `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    $responseProps,
    $serviceName 
} from 'services'

$fetch

const initialState: $stateProps = {}

const $sliceSlice = createSlice({
    name: '$slName',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            fetchOrgUnitsGetList.fulfilled,
            (state, { payload }) => payload,
        )
    },
})

export default $sliceSlice.reducer`,
    fetch: `
export const fetchUnitsList = createAsyncThunk<
    CivDefUnitsGetListByParamProps,
    CivDefUnitsGetListByParamParamsProps
>('civilDefenceUnits/$requestName', async (params, { rejectWithValue }) => {
    try {
        const { data } = await $serviceName.$requestName({
            ...params,
        })
        return data
    } catch (err) {
        return rejectWithValue(err)
    }
})
`,
    get: `get = () => {
        return api.$method<$responseProps>(
            '$route',
        )
    }
    `,
    getByParam: `getByParam = (params: $params) => {
        return api.$method<$responseProps>(
            '$route',
            { params: params },
        )
    }
    `,
    getById: `getById = (id: number) => {
        return api.$method<$responseProps>(
            '$route/\${id}',
        )
    }
    `,
    getList: `getList = () => {
        return api.$method<$responseProps>(
            '$route',
        )
    }
    `,
    getListByParam: `getListByParam = (params: $params) => {
        return api.$method<$responseProps>(
            '$route',
            { params: params },
        )
    }
    `,
    getListById: `getListById = (id: number) => {
        return api.$method<$responseProps>(
            '$route/\${id}',
        )
    }
    `,
    create: `create = (params: $params) => {
        return api.post<$responseProps>(
            '$route',
            { params: params },
        )
    }
    `,
    delete: `getListById = (id: number) => {
        return api.delete('$route/\${id}')
    }
    `,
}

export default code
