import select from 'select-dom'
import { getPlayer } from '../libs/faceit'
import { getTeamElements } from '../libs/match-room'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import createFlagElement from '../components/flag'

const FEATURE_ATTRIBUTE = 'pick-player-flag'

export default async parentElement => {
  const { isTeamV1Element } = getTeamElements(parentElement)

  if (isTeamV1Element) {
    return
  }

  const captainPickElement = select(
    `div.match-voting[ng-include="'blocks/v2/matchroom/main/captain-pick-block.html'"] ul`,
    parentElement
  )

  if (!captainPickElement) {
    return
  }

  const playerPickElements = select.all(
    'li[ng-repeat*="player"]',
    captainPickElement
  )

  playerPickElements.forEach(async playerPickElement => {
    if (hasFeatureAttribute(playerPickElement, FEATURE_ATTRIBUTE)) {
      return
    }

    setFeatureAttribute(playerPickElement, FEATURE_ATTRIBUTE)

    const nicknameElement = select(
      'div[ng-bind="::player.nickname"]',
      playerPickElement
    )
    const nickname = nicknameElement.textContent

    const player = await getPlayer(nickname)

    if (!player) {
      return
    }

    const { country } = player

    const flagElement = createFlagElement({ country })

    nicknameElement.prepend(flagElement)
  })
}