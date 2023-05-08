// Copyright 2023 Paion Data. All rights reserved.
import { pick } from 'lodash-es'

import { SEMANTIC_TABLE_PROPS } from '../constants'

export default function getSemanticTableProps(props: any) {
  return pick(props, SEMANTIC_TABLE_PROPS)
}
