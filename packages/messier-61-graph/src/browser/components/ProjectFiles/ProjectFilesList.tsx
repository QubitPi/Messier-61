// Copyright 2023 Paion Data. All rights reserved.
import React from 'react'

import { SavedScriptsBody, SavedScriptsHeader } from '../SavedScripts/styled'
import ProjectFilesListItem from './ProjectFilesListItem'

export type ProjectFileScript = {
  content: Promise<string>
  filename: string
}

interface ProjectFileListProps {
  scripts: ProjectFileScript[]
  selectScript: (script: ProjectFileScript) => void
  removeScript: (script: ProjectFileScript) => void
  execScript: (cmd: string) => void
}

export default function ProjectFileList({
  scripts,
  selectScript,
  removeScript,
  execScript
}: ProjectFileListProps): JSX.Element {
  const sortedScripts = scripts.sort((f1, f2) =>
    f1.filename.localeCompare(f2.filename)
  )

  return (
    <SavedScriptsBody>
      <SavedScriptsHeader>Cypher files</SavedScriptsHeader>
      {sortedScripts.map(script => (
        <ProjectFilesListItem
          selectScript={selectScript}
          execScript={execScript}
          removeScript={removeScript}
          script={script}
          key={script.filename}
        />
      ))}
    </SavedScriptsBody>
  )
}
