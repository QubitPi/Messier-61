import { IEdgeBase, Orb } from "@memgraph/orb";
import { useEffect, useState } from "react";
import { Link, Node } from "../Graph";

interface OrbGraphProps {
  container: HTMLElement
  nodes: Node[]
  links: Link[]
}

export default function OrbGraph(props: OrbGraphProps): JSX.Element {
  const [orb, setOrb] = useState<Orb>(new Orb<Node, IEdgeBase>(props.container))

  useEffect(() => {
    const nodes = props.nodes;
    const edges = convertLinkToOrbEdge(props.links);
    orb.data.setup({ nodes, edges });
    orb.view.render(() => {orb.view.recenter()})
  })

  return <></>
}

function convertLinkToOrbEdge(links: Link[]): IEdgeBase[] {
  return links.map(link => {
    return {
      id: link.id,
      start: link.source,
      end: link.target
    }
  })
}