const code = {
    service: `
        import api from 'api'
        import { $responseProps } from './$fileName.types'

        class $serviceName {
            $request
        }
        
        export default new $serviceName()`,
}

export default code
