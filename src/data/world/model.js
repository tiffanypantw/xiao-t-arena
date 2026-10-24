export function storyPath(story){return `/world/${story.id}`;}
export function worldPoint(longitude,latitude){return [(longitude+180)/360*1000,(90-latitude)/180*500];}
export function localDate(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
export function isStoryVisible(story,now=new Date()){return story.status==='published'&&story.published_date<=localDate(now);}
export function validateStories(stories){
 const errors=[];
 for(const s of stories){
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s.id||'')||!s.title||!s.country||!s.region)errors.push('Invalid story identity');
  if(!['draft','published','archived'].includes(s.status)||!['evergreen','news'].includes(s.content_type))errors.push(`${s.id}: invalid status/type`);
  for(const key of ['published_date','event_date'])if(s[key]!==null&&(!/^\d{4}-\d{2}-\d{2}$/.test(s[key]||'')||Number.isNaN(Date.parse(s[key]))||new Date(s[key]).toISOString().slice(0,10)!==s[key]))errors.push(`${s.id}: invalid ${key}`);
  if(s.status==='published'&&(!s.published_date||!s.sources?.length||!s.concepts?.length||!s.subjects?.length||!s.background||!s.summary||!s.curiosity))errors.push(`${s.id}: incomplete published story`);
  if(s.content_type==='news'&&(!s.event_date||!s.sources?.some(source=>/^https:\/\//.test(source.url))))errors.push(`${s.id}: news requires an event date and external sources`);
  if(!Number.isFinite(s.latitude)||Math.abs(s.latitude)>90||!Number.isFinite(s.longitude)||Math.abs(s.longitude)>180)errors.push(`${s.id}: invalid coordinates`);
  if(s.resource_path!==null&&!/^\/resources\/ep\d{3}$/.test(s.resource_path||''))errors.push(`${s.id}: invalid resource route`);
  for(const source of s.sources||[])if(!source.title||!(/^(https:\/\/|\/resources\/ep\d{3}$)/.test(source.url||'')))errors.push(`${s.id}: unsafe source`);
 }
 if(new Set(stories.map(s=>s.id)).size!==stories.length)errors.push('Duplicate story id');
 return errors;
}
export function dailyNews(stories,now=new Date()){return stories.filter(s=>isStoryVisible(s,now)&&s.content_type==='news'&&s.published_date===localDate(now)).slice(0,3);}
