export const MERIDIANS_NAME = {
  front: [
    null, '足厥阴肝经', '手太阴肺经', '足太阴脾经', '手厥阴心包经', '手少阴心经', '任脉', '足阳明胃经',
  ],
  side: [
    null, '足少阳胆经', '手阳明大肠经', '足少阴肾经', '手少阳三焦经',
  ],
  back: [
    null, '手太阳小肠经', '足太阳膀胱经', '督脉',
  ]
};

export const MAX_GROUP_OF = {
  front: 7,
  side: 4,
  back: 3
}

// TODO：MERGE
export type TimeBasedTask = {
  from: number,
  to: number,
  name: string,
  graph: {
    direction: 'front' | 'back' | 'side',
    index: number,
  }
}

export type Line = {
  name: string,
  graph: {
    direction: 'front' | 'back' | 'side',
    index: number,
  }
}

// TODO：MERGE
export const TIMEMAP: TimeBasedTask[] = [
  { from: 0, to: 1, name: '足少阳胆经', graph: {direction: 'side', index: 1} },
  { from: 1, to: 3, name: '足厥阴肝经', graph: {direction: 'front', index: 1} },
  { from: 3, to: 5, name: '手太阴肺经', graph: {direction: 'front', index: 2} },
  { from: 5, to: 7, name: '手阳明大肠经', graph: {direction: 'side', index: 2} },
  { from: 7, to: 9, name: '足阳明胃经', graph: {direction: 'front', index: 7} },
  { from: 9, to: 11, name: '足太阴脾经', graph: {direction: 'front', index: 3} },
  { from: 11, to: 13, name: '手少阴心经', graph: {direction: 'front', index: 5} },
  { from: 13, to: 15, name: '手太阳小肠经', graph: {direction: 'back', index: 1} },
  { from: 15, to: 17, name: '足太阳膀胱经', graph: {direction: 'back', index: 2} },
  { from: 17, to: 19, name: '足少阴肾经', graph: {direction: 'side', index: 3} },
  { from: 19, to: 21, name: '手厥阴心包经', graph: {direction: 'front', index: 4} },
  { from: 21, to: 23, name: '手少阳三焦经', graph: {direction: 'side', index: 4} },
  { from: 23, to: 24, name: '足少阳胆经', graph: {direction: 'side', index: 1} },
]

export const LINEMAP: Line[] = [
  { name: '足少阳胆经', graph: {direction: 'side', index: 1} },
  { name: '足厥阴肝经', graph: {direction: 'front', index: 1} },
  { name: '手太阴肺经', graph: {direction: 'front', index: 2} },
  { name: '手阳明大肠经', graph: {direction: 'side', index: 2} },
  { name: '足阳明胃经', graph: {direction: 'front', index: 7} },
  { name: '足太阴脾经', graph: {direction: 'front', index: 3} },
  { name: '手少阴心经', graph: {direction: 'front', index: 5} },
  { name: '手太阳小肠经', graph: {direction: 'back', index: 1} },
  { name: '足太阳膀胱经', graph: {direction: 'back', index: 2} },
  { name: '足少阴肾经', graph: {direction: 'side', index: 3} },
  { name: '手厥阴心包经', graph: {direction: 'front', index: 4} },
  { name: '手少阳三焦经', graph: {direction: 'side', index: 4} },
  { name: '足少阳胆经', graph: {direction: 'side', index: 1} },
  { name: '任脉', graph: {direction: 'front', index: 6} },
  { name: '督脉', graph: {direction: 'back', index: 3} },
]

export function findMeridianPosition(name: string): { direction: 'front' | 'back' | 'side', index: number } | null {
  const meridian = LINEMAP.find(item => item.name === name);
  return meridian ? meridian.graph : null;
}