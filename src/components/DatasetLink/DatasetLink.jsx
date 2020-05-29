import React from 'react'
import {Link} from 'react-router-dom'
import {PortalConfigs} from '../../portal_configs'

export default function DatasetLink({dataset,children,...props}){
    const {domain} = dataset.metadata
    const portal = Object.entries(PortalConfigs).find(c=>c[1].socrataDomain === domain)[0]

    return <Link {...props} to={`/${portal}/dataset/${dataset.resource.id}`}>
        {children}
         </Link>
}