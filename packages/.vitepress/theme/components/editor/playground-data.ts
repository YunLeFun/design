import type { PlaygroundMode, PlaygroundProject } from './playground-types'

export function createPlaygroundProjects(english: boolean): Record<PlaygroundMode, PlaygroundProject> {
  return {
    studio: {
      title: english ? 'A place for your ideas' : '让灵感，有处安放',
      subtitle: english ? 'YunLeFun Studio · A creator’s notebook' : '云乐坊 Studio · 创作手记',
      scenes: [
        { id: 'opening', name: english ? 'Opening' : '开场', title: english ? 'A place for your ideas' : '让灵感，有处安放', body: english ? 'An idea can start anywhere. In a note, a conversation, or a quiet moment on the way home.\n\nGive it a little room. Find the words, put the pieces in order, and turn it into something you can share.' : '一个想法，可能出现在任何地方。\n在随手记下的一句话里，在一次聊天中，也在回家的路上。\n\n给它留一点空间。慢慢找到表达，把零散的片段，整理成可以分享的作品。', direction: english ? 'Open on the title. Leave a short pause before the voiceover.' : '标题先出现，留半拍，再进入旁白。画面保持简单，让文字成为主角。', duration: 8, status: 'ready' },
        { id: 'process', name: english ? 'The process' : '创作过程', title: english ? 'One small step at a time' : '把想法，一点点变成作品', body: english ? 'Start with a sentence. Shape it into a script, then a storyboard.\n\nKeep the tools close and the work in view. Every small change brings the idea a little closer.' : '先写一句话，再整理成脚本。\n把脚本拆成分镜，为每个片段找到合适的画面与声音。\n\n工具就在手边，内容始终在眼前。每一次小小的修改，都让想法更清楚一点。', direction: english ? 'Show the script and storyboard together. Follow the current selection.' : '录屏展示脚本与分镜的联动，镜头跟随当前选择，不额外叠加装饰。', duration: 16, status: 'draft' },
        { id: 'ending', name: english ? 'Closing' : '结尾', title: english ? 'Make something of your own' : '下一份作品，从这里开始', body: english ? 'Some ideas need time. Others just need a place to begin.\n\nWhat would you like to make today?' : '有些想法，需要多一点时间。\n有些想法，只差一个开始。\n\n今天，你想做点什么？', direction: english ? 'Return to the title card. Hold the final line.' : '回到简洁的标题画面，最后一句多停留一拍。', duration: 6, status: 'draft' },
      ],
    },
    story: {
      title: english ? 'Letters from the clouds' : '来自云端的信',
      subtitle: english ? 'ADV.JS · Narrative workspace' : 'ADV.JS · 叙事工作区',
      scenes: [
        { id: 'platform', name: english ? 'The platform' : '云间站台', title: english ? 'The first letter' : '第一封信', body: english ? 'The last train slipped into the clouds, leaving a letter on the bench.\n\nXiaoyun: “There is no address. Just a name.”\n\nThe station keeper looked up. “Then perhaps it has already arrived.”' : '末班列车驶进云里，长椅上只剩下一封信。\n\n小云：「没有地址，只有一个名字。」\n\n站台管理员抬起头：「那它也许已经到站了。」', direction: english ? 'A quiet platform. Hold after the keeper’s reply.' : '安静的站台，远处传来风声。管理员说完后稍作停顿。', duration: 12, status: 'ready' },
        { id: 'letter', name: english ? 'An unsigned letter' : '没有署名的信', title: english ? 'To the person reading this' : '致正在读信的你', body: english ? '“If you find this letter, please take it to the place where the sky meets the sea.”\n\nXiaoyun turned the envelope over. A small blue cloud was drawn on the back.' : '「如果你捡到这封信，请把它带到天空与海相遇的地方。」\n\n小云翻过信封。背面画着一朵小小的蓝色云。', direction: english ? 'Show the envelope after the first line.' : '读完第一句后展示信封。蓝色云作为情节线索保留。', duration: 10, status: 'draft' },
        { id: 'departure', name: english ? 'Departure' : '向海出发', title: english ? 'A new direction' : '去看看吧', body: english ? 'Xiaoyun folded the letter and looked beyond the tracks.\n\nXiaoyun: “I think I know where to start.”' : '小云把信折好，望向铁轨延伸的方向。\n\n小云：「我想，我知道从哪里开始了。」', direction: english ? 'End on the horizon. Let the next chapter continue the journey.' : '画面停在远方的地平线，下一章继续这段旅程。', duration: 8, status: 'draft' },
      ],
    },
  }
}
