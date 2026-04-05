type CardDescription = {
  rank: string;
  value: string;
  modifier: string;
};

type Translations = {
  enemy: string;
  yourHand: (count: number) => string;
  selectCardsHint: string;
  deckRemaining: (count: number) => string;
  selectCardsToPlay: string;
  playCards: (count: number) => string;
  currentValue: string;
  mainCard: string;
  modifiers: (count: number) => string;
  applyNextModifier: string;
  continue: string;
  drawCards: (count: number) => string;
  captured: string;
  drawCardsBtn: string;
  gameOver: string;
  youWin: string;
  playAgain: string;
  help: string;
  helpTitle: string;
  objectiveTitle: string;
  objectiveText: string;
  howToPlayTitle: string;
  howToPlaySteps: string[];
  cardReferenceTitle: string;
  cardTableHeaders: { card: string; value: string; modifierEffect: string };
  cardDescriptions: CardDescription[];
  closeHelp: string;
};

const en: Translations = {
  enemy: "Enemy",
  yourHand: (count) => `Your Hand (${count})`,
  selectCardsHint:
    "Select cards to play — first card is your main, rest are modifiers.",
  deckRemaining: (count) => `Deck: ${count} remaining`,
  selectCardsToPlay: "Select cards to play",
  playCards: (count) => `Play (${count} card${count > 1 ? "s" : ""})`,
  currentValue: "Current Value: ",
  mainCard: "Main Card",
  modifiers: (count) => `Modifiers (${count})`,
  applyNextModifier: "Apply Next Modifier",
  continue: "Continue",
  drawCards: (count) => `Draw ${count} card${count !== 1 ? "s" : ""}`,
  captured: "Captured!",
  drawCardsBtn: "Draw Cards",
  gameOver: "Game Over! Your value wasn\u2019t enough to beat the enemy.",
  youWin: "You win! You\u2019ve cleared the entire deck!",
  playAgain: "Play Again",
  help: "Help",
  helpTitle: "How to Play",
  objectiveTitle: "Objective",
  objectiveText:
    "Beat the enemy card by playing a main card with a higher value. Use modifier cards to boost your main card\u2019s value or gain special effects.",
  howToPlayTitle: "How to Play a Turn",
  howToPlaySteps: [
    "Select one or more cards from your hand.",
    "The first card selected is your main card \u2014 its face value must beat the enemy.",
    "Any additional cards become modifiers and are applied in reverse order.",
    "If your final value exceeds the enemy\u2019s, you win the round!",
  ],
  cardReferenceTitle: "Card Reference",
  cardTableHeaders: {
    card: "Card",
    value: "Value",
    modifierEffect: "Modifier Effect",
  },
  cardDescriptions: [
    {
      rank: "Ace",
      value: "1",
      modifier: "Returns the main card to your hand after playing.",
    },
    { rank: "2", value: "2", modifier: "Doubles the main card's value." },
    { rank: "3", value: "3", modifier: "Adds 5 to the main card's value." },
    {
      rank: "4",
      value: "4",
      modifier:
        "Adds 3 to the main card's value and returns itself to your hand.",
    },
    {
      rank: "5",
      value: "5",
      modifier:
        "Captures the enemy card and adds it to your hand if you win the round.",
    },
    {
      rank: "6",
      value: "6",
      modifier: "Draw 1 extra card at the start of the next round.",
    },
    {
      rank: "7",
      value: "7",
      modifier:
        "Draw 2 extra cards at the start of the next round if your current hand has 5 or fewer cards.",
    },
    {
      rank: "8 - K",
      value: "8 - 13",
      modifier: "Adds 1 to the main card's value.",
    },
  ],
  closeHelp: "Close help",
};

const zh: Translations = {
  enemy: "敌方",
  yourHand: (count) => `你的手牌（${count}）`,
  selectCardsHint: "选择要出的牌——第一张是主牌，其余为修饰牌。",
  deckRemaining: (count) => `牌堆：剩余 ${count} 张`,
  selectCardsToPlay: "选择要出的牌",
  playCards: (count) => `出牌（${count} 张）`,
  currentValue: "当前数值：",
  mainCard: "主牌",
  modifiers: (count) => `修饰牌（${count}）`,
  applyNextModifier: "应用下一个修饰效果",
  continue: "继续",
  drawCards: (count) => `抽 ${count} 张牌`,
  captured: "捕获！",
  drawCardsBtn: "抽牌",
  gameOver: "游戏结束！你的数值不足以击败敌方。",
  youWin: "你赢了！你已清空整副牌！",
  playAgain: "再来一局",
  help: "帮助",
  helpTitle: "游戏说明",
  objectiveTitle: "目标",
  objectiveText:
    "通过出一张数值更高的主牌来击败敌方牌。使用修饰牌来提升主牌数值或获得特殊效果。",
  howToPlayTitle: "如何进行一回合",
  howToPlaySteps: [
    "从手牌中选择一张或多张牌。",
    "第一张选中的牌为主牌——其牌面数值必须超过敌方。",
    "其余选中的牌成为修饰牌，按逆序依次生效。",
    "若你的最终数值超过敌方，则赢得本回合！",
  ],
  cardReferenceTitle: "牌面说明",
  cardTableHeaders: { card: "牌面", value: "数值", modifierEffect: "修饰效果" },
  cardDescriptions: [
    { rank: "A", value: "1", modifier: "出牌后将主牌返回手牌。" },
    { rank: "2", value: "2", modifier: "主牌数值翻倍。" },
    { rank: "3", value: "3", modifier: "主牌数值加 5。" },
    { rank: "4", value: "4", modifier: "主牌数值加 3，并将自身返回手牌。" },
    {
      rank: "5",
      value: "5",
      modifier: "若本回合获胜，则捕获敌方牌并加入手牌。",
    },
    { rank: "6", value: "6", modifier: "下回合开始时额外抽 1 张牌。" },
    {
      rank: "7",
      value: "7",
      modifier: "若当前手牌不超过 5 张，下回合开始时额外抽 2 张牌。",
    },
    { rank: "8 - K", value: "8 - 13", modifier: "主牌数值加 1。" },
  ],
  closeHelp: "关闭帮助",
};

// ==================== JAPANESE (ja) ====================
const ja: Translations = {
  enemy: "敵",
  yourHand: (count) => `手札（${count}）`,
  selectCardsHint: "出すカードを選んでください——最初のカードがメインカード、残りは修飾カードです。",
  deckRemaining: (count) => `山札：残り ${count} 枚`,
  selectCardsToPlay: "出すカードを選んでください",
  playCards: (count) => `出す（${count} 枚）`,
  currentValue: "現在の値：",
  mainCard: "メインカード",
  modifiers: (count) => `修飾カード（${count}）`,
  applyNextModifier: "次の修飾効果を適用",
  continue: "続ける",
  drawCards: (count) => `${count} 枚引く`,
  captured: "捕獲！",
  drawCardsBtn: "カードを引く",
  gameOver: "ゲームオーバー！あなたの値は敵を倒すには足りませんでした。",
  youWin: "あなたの勝ち！デック全体をクリアしました！",
  playAgain: "もう一度プレイ",
  help: "ヘルプ",
  helpTitle: "遊び方",
  objectiveTitle: "目標",
  objectiveText:
    "より高い値のメインカードを出して敵のカードを倒しましょう。修飾カードを使ってメインカードの値を上げたり、特殊効果を得たりできます。",
  howToPlayTitle: "ターンの進め方",
  howToPlaySteps: [
    "手札から1枚以上のカードを選んでください。",
    "最初に選んだカードがメインカードです——その数値が敵を上回る必要があります。",
    "追加で選んだカードは修飾カードになり、逆順に適用されます。",
    "最終的な値が敵を超えれば、このラウンドの勝利です！",
  ],
  cardReferenceTitle: "カード一覧",
  cardTableHeaders: { card: "カード", value: "数値", modifierEffect: "修飾効果" },
  cardDescriptions: [
    { rank: "A", value: "1", modifier: "出した後、メインカードを手札に戻す。" },
    { rank: "2", value: "2", modifier: "メインカードの値を2倍にする。" },
    { rank: "3", value: "3", modifier: "メインカードの値に5を加える。" },
    { rank: "4", value: "4", modifier: "メインカードの値に3を加え、このカード自身を手札に戻す。" },
    {
      rank: "5",
      value: "5",
      modifier: "このラウンドに勝った場合、敵のカードを捕獲して手札に加える。",
    },
    { rank: "6", value: "6", modifier: "次のラウンド開始時に追加で1枚引く。" },
    {
      rank: "7",
      value: "7",
      modifier: "現在の手札が5枚以下の場合、次のラウンド開始時に追加で2枚引く。",
    },
    { rank: "8 - K", value: "8 - 13", modifier: "メインカードの値に1を加える。" },
  ],
  closeHelp: "ヘルプを閉じる",
};

export const translations: Record<string, Translations> = { en, zh, ja };
export type { Translations };
