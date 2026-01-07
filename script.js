// ===============================
// PANINI : RÔLES DÉTAILLÉS
// ===============================
window.paniniRoles = [
    {
        id: "LE PAYSAN",
        title: "Le Paysan",
        image: "le_paysan.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_paysan.svg" class="emoji-svg" alt="Paysan"> <strong>Le Paysan</strong>
        </span><br>
        <em>Un humble paysan sans pouvoirs magiques, mais dont la voix peut changer le destin du village.</em><br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider le village à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous sont éliminés (et, le cas échéant, tous les rôles solos également).<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoirs"> <strong>Pouvoirs</strong>
        </span><br>
        Aucun pouvoir spécial : tu votes contre ceux que tu suspects. Ta parole et ton intuition sont tes seules armes.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Observe ceux qui parlent peu… ou qui essaient d’influencer la discussion.<br>
        - N’hésite pas à exprimer tes doutes, même si tu n’es pas certain.<br>
        - Collabore avec les autres paysan pour ne pas rester isolé.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Le paysan est un personnage qui incarne l'habitant basique d'un village. Son rôle est de découvrir l'identité des loups-garous et de les éliminer avant qu'ils ne tuent tous les paysans. Il gagne lorsque tous les loups-garous sont morts. Le paysan n'a aucun pouvoir spécial, si ce n'est de voter au conseil du village contre celui qu'il suspecte être loup-garou.
        `
    },
    {
        id: "LA SORCIÈRE",
        title: "La Sorcière",
        image: "la_sorciere.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="la_sorciere.svg" class="emoji-svg" alt="Sorcière"> <strong>La Sorcière</strong>
        </span><br>
        Gardienne des potions secrètes, elle détient le pouvoir de sauver une vie ou d’en retirer une autre, mais chaque choix est unique et décisif.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et protéger le village en utilisant habilement tes potions.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoirs"> <strong>Pouvoirs</strong>
        </span><br>
        Tu possèdes deux potions.<br>
        Potion de guérison (unique) : ressuscite la personne tuée pendant la nuit.<br>
        Potion d’empoisonnement (unique) : tues quelqu’un, en plus de la victime désignée par les loups.<br>
        Tu peux choisir de ne rien faire pendant une nuit.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        Utilise ta potion de guérison seulement quand c’est vraiment nécessaire — sauver un rôle-clé peut changer la partie.<br>
        L’empoisonnement est une arme puissante mais à manier avec prudence.<br>
        Reste discrète sur ton identité pour éviter d’être la cible des loups.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        La sorcière possède deux potions : une de guérison et une d'empoisonnement. Ressusciter la personne tuée et donc perdre sa seule potion de guérison. tuer une autre personne en plus de la victime et donc perdre sa seule potion d'empoisonnement. Ou ne rien faire.
        `
    },
    {
        id: "L’HOMME À LA HACHE",
        title: "L’Homme à la Hache",
        image: "l_homme_a_la_hache.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="l_homme_a_la_hache.svg" class="emoji-svg" alt="Hache"> <strong>L’Homme à la Hache</strong>
        </span><br>
        Paysan robuste à l’instinct de survie farouche, il manie sa hache comme bouclier ultime lors du jugement du village.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider le village à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoirs"> <strong>Pouvoirs</strong>
        </span><br>
        La nuit : Tu es vulnérable — si tu es la cible des loups-garous ou empoisonné par la sorcière, tu meurs comme un simple paysan.<br><br>
        Le jour : Si tu es éliminé au vote, tu retournes ta condamnation contre un de tes accusateurs : il meurt à ta place, et tu survies !<br>
        Après ce pouvoir, tu deviens un paysan ordinaire sans pouvoirs.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Sois prudent pour ne pas attirer trop de soupçons lors des votes publics.<br>
        - Si tu sens que tu es en danger, pense à qui tu accuseras en représailles.<br>
        - Une fois ton pouvoir utilisé, adopte la stratégie d’un paysan classique.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        L’homme à la hache est un paysan redoutable. La nuit, il meurt s’il est la cible des loups-garous ou s’il est touché par la potion empoisonnée de la sorcière mal utilisée.<br>
        En revanche, si l’homme à la hache est éliminé lors du vote de jour, il peut retourner cette élimination contre l’un des opposants qui voulait sa mort, et survit au bûcher. Après cela, il redevient un simple paysan.
        `
    },
    {
        id: "CERBÈRE",
        title: "Cerbère",
        image: "cerbere.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="cerbere.svg" class="emoji-svg" alt="Cerbère"> <strong>Cerbère</strong>
        </span><br>
        Gardien puissant au flair redoutable, Cerbère veille chaque matin sur l’ordre du village. Sa vigilance dépend de la proximité des menaces…<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoirs"> <strong>Pouvoirs</strong>
        </span><br>
        Chaque matin, si tu es placé juste à droite ou juste à gauche d’un loup-garou, tu “te réveilles” (le MJ te l’annonce).<br>
        Sinon, tu “dors” (pas d’action ni d’information).<br>
        Si tu es infecté par le papa des loups, tu restes réveillé jusqu’à la fin de la partie.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Observe attentivement qui te jouxte : ta position peut tout changer.<br>
        - Reste discret sur ton statut (éveillé ou endormi) pour éviter d’attirer les suspicions ou les dangers.<br>
        - Si tu deviens infecté, surveille les stratégies des loups-garous pour les anticiper.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Chaque matin, si Cerbère se trouve à droite ou à gauche d'un loup-garou, Cerbère se réveille, sinon il dort (le MJ). Si Cerbère est infecté par le papa des loups, il sera réveillé jusqu'à la fin de la partie.
        `
    },
    {
        id: "LE CONDAMNÉ",
        title: "Le Condamné",
        image: "le_condamne.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_condamne.svg" class="emoji-svg" alt="Condamné"> <strong>Le Condamné</strong>
        </span><br>
        Un paysan en sursis : avant de déclencher son dernier secret, il doit sentir si le village est prêt à lui accorder une seconde chance.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Aider les paysans à éliminer tous les loups-garous (et, le cas échéant, les rôles solos) et survivre si possible.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        À tout moment, tu peux te révéler publiquement et choisir un joueur dont le Maître du Jeu t’annonce en secret le rôle exact.<br>
        Tu ne peux pas demander à connaître le rôle d’un joueur dont l’identité est déjà 100% connue du village.<br>
        Tu peux révéler ou mentir sur ce rôle au village, selon ta stratégie.<br>
        Avant de te révéler, sois sûr que la majorité du village est prête à te gracier :<br><br>
        Si le village vote à la majorité pour te gracier, tu deviens la copie du rôle observé et continues la partie.<br>
        Sinon, le village préfère éliminer un autre joueur et tu meurs immédiatement.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Évalue bien la confiance que t’accorde le village avant de te révéler.<br>
        - Choisis de révéler un rôle utile mais non déjà connu pour maximiser tes chances.<br>
        - Mentir peut sauver ta vie mais peut aussi te faire perdre toute confiance.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Chaque nuit est une pendaison différée. Le Condamné est en sursis dès le début de la partie. À tout moment, il peut se révéler publiquement et découvrir le rôle exact d’un joueur dont l’identité n’est pas déjà connue du village. Il peut ensuite révéler ou inventer cette information. Si la majorité du village choisit de le gracier, il devient la copie du rôle observé et continue la partie. Sinon, si le village préfère éliminer un autre joueur, sa mort est inéluctable.
        `
    },
    {
        id: "LE MENTALISTE",
        title: "Le Mentaliste",
        image: "le_mentaliste.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_mentaliste.svg" class="emoji-svg" alt="Mentaliste"> <strong>Le Mentaliste</strong>
        </span><br>
        Un paysan doté d’une intuition hors du commun, capable de déceler les alliances cachées au cœur de la nuit.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Chaque nuit, tu désignes deux joueurs de ton choix.<br>
        Le Maître du Jeu t’indique si ces deux joueurs appartiennent à la même équipe ou non, sans révéler les rôles exacts.<br>
        Exemple : Si tu choisis un Loup-Garou et la Sorcière, le MJ te répondra : « Ces joueurs ne sont pas dans la même équipe. »<br>
        Ce pouvoir te permet d’orienter tes soupçons sans tout savoir.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Varie tes cibles pour maximiser tes chances d’obtenir des informations stratégiques.<br>
        - N’interprète pas trop vite : certains rôles solos ou neutres peuvent brouiller les pistes.<br>
        - Partage tes découvertes aux autres paysans au moment opportun, pour influencer les votes.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Chaque nuit, le Mentaliste désigne deux joueurs de son choix. Le Maître du Jeu lui indique alors si ces deux joueurs appartiennent à la même équipe ou non, sans révéler leurs rôles exacts. Exemple : Si le Mentaliste choisit un Loup-Garou et la Sorcière, le MJ répondra : « Ces joueurs ne sont pas dans la même équipe. » Ce pouvoir permet au Mentaliste de mieux orienter ses choix… sans pour autant tout savoir. Il reste versatile, douteux, parfois mal influencé.
        `
    },
    {
        id: "L’INSOMNIAQUE",
        title: "L’Insomniaque",
        image: "l_insomniaque.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="l_insomniaque.svg" class="emoji-svg" alt="Insomniaque"> <strong>L’Insomniaque</strong>
        </span><br>
        Un paysan dont les nuits sont agitée : il perçoit les troubles du sommeil autour de lui et devine les secrets des interactions nocturnes.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Chaque matin, si tu es placé juste à droite ou à gauche d’un joueur ayant eu une interaction nocturne (pouvoir, attaque, sort, etc.), alors le narrateur t’indique s’il y a eu un “sommeil de mauvaise qualité” autour de toi pendant la nuit.<br>
        Tu ne connais pas la nature exacte de l’interaction, mais tu sais qu’il s’est passé quelque chose d’anormal.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Observe qui te voisine et tente de recouper les indices avec tes sensations nocturnes.<br>
        - Utilise ces informations pour orienter subtilement les votes sans te dévoiler trop vite.<br>
        - Attention : tous ceux qui ont bougé ne sont pas forcément des loups-garous ; prudence et réflexion sont de mise.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Chaque matin, si l'insomniaque se trouve à droite ou à gauche d'un joueur ayant eu une interaction nocturne, alors le narrateur lui indiquera si des joueurs ont eu un sommeil de mauvaise qualité pendant la nuit.
        `
    },
    {
        id: "L’ORPHELIN",
        title: "L’Orphelin",
        image: "l_orphelin.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="l_orphelin.svg" class="emoji-svg" alt="Orphelin"> <strong>L’Orphelin</strong>
        </span><br>
        Un paysan qui rêve d’une vraie famille : le destin lie sa vie à celle d’un couple désigné au début de la partie.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Au début de la partie, tu formes un “couple” (désigné par le MJ) avec deux joueurs.<br>
        Si l’un des membres du couple meurt, l’autre meurt aussi immédiatement.<br>
        Mais : si le couple est éliminé et que tu es toujours en vie, tu peux choisir de récupérer le rôle et les pouvoirs spéciaux d’un des deux membres du couple, puis continuer la partie avec ce rôle.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Reste discret sur ton identité et ton lien avec eux.<br>
        - Si tu gagnes un nouveau rôle, utilise-le judicieusement pour inverser le cours de la partie.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Son plus grand rêve, c'est d'avoir des parents qu'il n'a jamais eus. L'orphelin forme un couple au début de la partie. Ce couple sera lié par les lois du Village Maudit : si l'un meurt, l'autre meurt aussi immédiatement. Mais si l'orphelin est toujours en jeu après la mort du couple, il pourra choisir de récupérer le rôle et les facultés spéciales de l’un des deux, et continuer la partie avec ce nouveau pouvoir.
        `
    },
    {
        id: "LE TRAQUEUR",
        title: "Le Traqueur",
        image: "le_traqueur.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_traqueur.svg" class="emoji-svg" alt="Traqueur"> <strong>Le Traqueur</strong>
        </span><br>
        Fin limier et paysan déterminé, il repère les traces des loups mieux que nul autre, pour protéger sa communauté.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Une fois dans la partie, tu peux consulter le Maître du Jeu en secret pour connaître le nombre exact de loups-garous encore en vie.<br>
        Le MJ te répond alors en silence, avec les doigts.<br>
        Cette capacité est à usage unique : choisis le bon moment pour l’utiliser.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Utilise ce pouvoir quand un doute crucial plane sur la partie : en début, au milieu ou proche de la fin.<br>
        - Garde ton information discrète ou partage-la au bon moment pour influencer les votes.<br>
        - Reste prudent : si les loups te soupçonnent d’en savoir trop, tu deviens une cible.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Fin limier, le Traqueur suit la piste des Loups-Garous comme nul autre. Une fois dans la partie, il peut consulter le MJ en secret pour connaître le nombre exact de Loups-Garous encore en vie. Le MJ lui indiquera alors ce nombre en silence, avec les doigts. Une capacité unique… à utiliser au bon moment.
        `
    },
    {
        
        id: "LE DON JUAN",
        title: "Le Don Juan",
        image: "le_don_juan.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_don_juan.svg" class="emoji-svg" alt="Don Juan"> <strong>Le Don Juan</strong>
        </span><br>
        Séducteur légendaire, il manie le charme et les présents avec une dangereuse ambivalence...<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Le Cadeau de l’Amour : Deux fois dans la partie, pendant la nuit, tu peux choisir un joueur à qui offrir un cadeau.<br>
        Au lever du jour, le Maître du Jeu annonce : “[Nom du joueur] a reçu un cadeau de Don Juan.”<br>
        Le joueur doit alors décider publiquement :<br>
        - Ouvrir le cadeau<br>
        - Refuser le cadeau<br><br>
        Si le joueur ouvre le cadeau, son destin dépend de ton choix secret fait la nuit :<br><br>
        Cadeau Passionné : il reçoit le pouvoir de tuer un joueur de son choix pendant la journée (usage unique).<br>
        Cadeau Maudit : le cadeau contient la mort, il meurt immédiatement.<br><br>
        S’il refuse, il reste en vie, mais ne saura jamais ce que contenait le cadeau.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Choisis tes cibles avec soin : séduire ou éliminer ?<br>
        - Le timing et le bluff sont essentiels pour exploiter ton pouvoir efficacement.<br>
        - Attention à ne pas trop te faire remarquer, ton rôle peut te rendre vulnérable.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Séducteur légendaire, il n’a qu’une arme : le charme. Et un don irrésistible pour offrir… des présents dont on ne sort pas toujours vivant.
        Pouvoir : Le Cadeau de l’Amour.
        Deux fois dans la partie, quand il le souhaite pendant la nuit, Don Juan peut choisir un joueur à qui offrir un cadeau. Au lever du jour, le Maître du Jeu annonce : [Nom du joueur] a reçu un cadeau de Don Juan. Ce joueur devra alors décider publiquement : Ouvrir le cadeau ou le refuser.
        S’il l’ouvre, son destin dépend du choix secret de Don Juan :<br><br>
        Cadeau Passionné : il reçoit le pouvoir de tuer un joueur de son choix pendant la journée (une seule fois).<br>
        Cadeau Maudit : le présent contenait la mort. Le joueur meurt immédiatement.<br>
        S’il refuse, il reste en vie… mais ne saura jamais ce que contenait le cadeau.<br>
        C’est Don Juan, et lui seul, qui décide la nature du présent lors de la nuit où il agit.
        `
    },
    {
        id: "LA CAMERISTE",
        title: "La Camériste",
        image: "la_cameriste.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="la_cameriste.svg" class="emoji-svg" alt="Camériste"> <strong>La Camériste</strong>
        </span><br>
        Une maîtresse de l’ombre, prête à tout pour prolonger son séjour en usurpant un destin.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à éliminer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Une fois dans la partie, immédiatement avant que le Maître du Jeu révèle le rôle d’un joueur éliminé par le village pendant la journée, tu peux interrompre la révélation en disant : « STOP, je suis la Camériste, je veux récupérer ce rôle. »<br>
        Le village ferme alors les yeux.<br>
        Tu prends secrètement connaissance du rôle du joueur éliminé et le remplaces immédiatement.<br>
        Tu adoptes ses pouvoirs et son objectif, et restes dans la partie sous cette nouvelle identité.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Choisis le moment où l’élimination d’un joueur est favorable pour toi.<br>
        - Prépare-toi à changer complètement de stratégie selon ton nouveau rôle.<br>
        - Reste discrète pour éviter de susciter trop de soupçons.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Une fois dans la partie, juste avant que le MJ ne révèle le rôle d’un joueur éliminé par le village pendant la journée, elle peut interrompre en disant : "STOP, je suis la Camériste, je veux récupérer ce rôle." Le village ferme alors les yeux, la Camériste prend secrètement connaissance du rôle du joueur éliminé et le remplace : elle adopte immédiatement son pouvoir et son objectif. Elle reste ensuite dans la partie sous sa nouvelle identité.
        `
    },
    {
        id: "LA BALANCE",
        title: "La Balance",
        image: "la_balance.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="la_balance.svg" class="emoji-svg" alt="Balance"> <strong>La Balance</strong>
        </span><br>
        Dans le Village Maudit, dénoncer les loups est risqué… La Balance joue sa vie en cherchant la vérité.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à éliminer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Chaque nuit, tu peux choisir de te réveiller et désigner un joueur.<br><br>
        Si tu désignes un loup-garou, au réveil du village, le narrateur pointera du doigt ce loup-garou, révélant publiquement son identité.<br>
        Si tu désignes un joueur non loup-garou, tu meurs instantanément.<br>
        Un pouvoir qui demande réflexion et audace : le verdict est sans appel !<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - N’utilise ton pouvoir que si tu es presque certain de l’identité du loup-garou.<br>
        - Observer les comportements et écouter les débats du jour peut t’aider à faire le bon choix.<br>
        - Reste discret, car si ton rôle est connu, tu deviendras vite une cible pour les loups-garous.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Personne n'aime les balances ici sauf, dans le Village Maudit. La Balance est un paysan, mais avec un pouvoir à ne pas mettre entre toutes les mains. Chaque nuit, la Balance se réveille et peut choisir ou non de désigner une personne. Si cette personne est un loup-garou, alors au réveil du village, le narrateur pointera du doigt le loup en question, révélant son identité à tout le monde. En revanche, si la Balance désigne un joueur non loup, la Balance meurt instantanément. Eh oui, personne n'aime les balances ici !
        `
    },
    {
        id: "LE CHUCHOTEUR",
        title: "Le Chuchoteur",
        image: "le_chuchoteur.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_chuchoteur.svg" class="emoji-svg" alt="Chuchoteur"> <strong>Le Chuchoteur</strong>
        </span><br>
        Maître du silence, il sait quand un mot de trop peut tout faire basculer… et le fait taire au bon moment.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à éliminer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Chaque nuit, tu choisis un joueur qui sera réduit au silence pour la journée suivante.<br>
        Ce joueur ne pourra pas prendre la parole lors des débats, ni se défendre, ni accuser.<br>
        Un simple murmure de ta part, et toute la dynamique du conseil est bouleversée.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Utilise ton pouvoir pour protéger un allié en danger ou pour révéler la nervosité d’un suspect.<br>
        - Ta capacité peut attirer la suspicion : reste discret sur tes intentions !<br>
        - Taire une voix influente au bon moment peut orienter le vote décisif.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Empêcher quelqu'un de parler, surtout quand le village commence à avoir des soupçons contre vous… Voilà tout l’art du Chuchoteur. Chaque nuit, il choisit un joueur qui sera réduit au silence pendant toute la journée suivante, incapable de s'exprimer lors des débats. Une capacité simple, mais diablement efficace.
        `
    },
    {
        id: "LA FILLE",
        title: "La Fille",
        image: "la_fille.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="la_fille.svg" class="emoji-svg" alt="Fille"> <strong>La Fille</strong>
        </span><br>
        La benjamine du village : sa vie est liée à celle du Bûcheron, protecteur infatigable.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Tant que le Bûcheron est en vie dans la partie, tu ne peux pas mourir, quelle que soit l’attaque ou la tentative d’élimination.<br>
        Une protection silencieuse… jusqu’à la disparition de ton père.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Protège le Bûcheron pour préserver ta propre survie.<br>
        - Reste discrète : les adversaires pourraient chercher à découvrir ton identité.<br>
        - Une fois le Bûcheron mort, joue comme une paysanne ordinaire.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Paysanne de père en fille : tant que le Bûcheron est en vie, la Fille ne peut pas mourir.
        `
    },
    {
        id: "LA DAME DE COMPLAISANCE",
        title: "La Dame de Complaisance",
        image: "la_dame_de_complaisance.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="la_dame_de_complaisance.svg" class="emoji-svg" alt="Dame"> <strong>La Dame de Complaisance</strong>
        </span><br>
        Fille de joie au grand cœur, elle traverse le village chaque nuit, cherchant l’amour… ou la survie.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Chaque nuit, tu peux choisir d’aller dormir chez un autre joueur.<br><br>
        Si tu dors chez un loup-garou, tu meurs au réveil.<br>
        Si tu dors chez un paysan, tu restes en vie.<br>
        Si tu dors chez quelqu’un (découches) et que tu es la cible des loups-garous, tu ne meurs pas : ton absence te protège.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Observe les comportements pour deviner chez qui il est sûr d’aller dormir.<br>
        - Découcher parfois peut te sauver la vie : utilise cette option si tu sens le danger.<br>
        - Reste discrète sur tes choix nocturnes pour éviter de devenir une cible.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Fille de joie de génération en génération, elle accumule les conquêtes et son bodycount est plus élevé que le PIB de Djibouti. Chaque nuit, cette paysanne au grand cœur peut, si elle le souhaite, aller dormir chez quelqu’un. Si elle dort chez un loup, elle meurt au réveil ; si elle dort chez une personne du village, elle reste en vie. Si elle dort chez quelqu’un (découche) et qu’elle est la cible des loups-garous pendant la nuit, elle ne meurt pas : son absence la protège.
        `
    },
    {
        id: "TARGET",
        title: "Target",
        image: "target.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="target.svg" class="emoji-svg" alt="Target"> <strong>Target</strong>
        </span><br>
        Pris pour cible par tout le monde, Target a appris à détourner l’attention… quitte à faire tomber l’orage sur un autre paysan à sa place.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à éliminer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir — Détournement de Cible</strong>
        </span><br>
        Au début de la partie, tu choisis un joueur comme « cible miroir ».<br>
        Ce joueur ne connaît pas ton choix, mais tout ce qui t’était destiné sera redirigé sur lui :<br>
        - Les loups veulent te dévorer ? C’est ta cible qui meurt à ta place.<br>
        - La sorcière veut te tuer ? Elle vise, mais c’est ta cible qui est empoisonnée.<br>
        - Le salvateur pense te protéger ? C’est ta cible qui reçoit le bouclier.<br>
        - Voyant, chasseur, autres pouvoirs ? Tout est redirigé sur ta cible.<br><br>
        Règle d’or : Tant que la cible est en vie, tu es intouchable.<br>
        Mais si elle meurt, tu redeviens une proie normale. Les effets, attaques et pouvoirs t’atteignent à nouveau directement.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Choisis ta cible miroir avec précaution : quelqu’un qui semble résistant ou discret pour durer longtemps.<br>
        - Reste sobre dans tes actions : révéler ton rôle trop tôt pourrait orienter la partie contre ta cible… et donc contre toi plus vite.<br>
        - Prépare un plan de survie pour le moment où tu pourrais redevenir vulnérable.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Il est traqué, pisté, visé de toutes parts... Alors il a trouvé la meilleure stratégie : faire porter le chapeau à quelqu’un d’autre.
        Pouvoir : Détournement de Cible. Au début de la partie, Target choisit un joueur comme "cible miroir". Ce joueur ne le saura pas, mais il subira tout ce qui devait arriver à Target :<br>
        🐺 Les loups veulent manger Target ? C’est sa cible qui finit en steak tartare.<br>
        🧪 La sorcière veut le tuer ? C’est la cible qui boit la mauvaise potion.<br>
        🛡️ Le salvateur veut protéger Target ? C’est la cible qui reçoit le bouclier.<br>
        🔍 Voyant, chasseur, n’importe quel pouvoir ? Tout est redirigé.<br>
        ⚠️ Règle d’or. Tant que la cible est en vie, Target est intouchable. Mais si la cible meurt… Target redevient une proie comme les autres. Et là, les vraies balles recommencent à le viser.
        `
    },
    {
        
        id: "LE MILLIARDAIRE",
        title: "Le Milliardaire",
        image: "le_milliardaire.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_milliardaire.svg" class="emoji-svg" alt="Milliardaire"> <strong>Le Milliardaire</strong>
        </span><br>
        Riche, arrogant et intouchable tant que son identité reste un secret. Les billets, ici, font et défont les rois du village.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir — Le Pouvoir de l’Argent</strong>
        </span><br>
        Tant que ta carte est face cachée (identité secrète), chaque nuit, tu peux choisir qui sera le maire du village.<br>
        Tu peux changer de choix autant de fois que tu le souhaites pendant la nuit.<br><br>
        *Tu es intouchable de jour* : personne ne peut te tuer au conseil, pas même par la vengeance d’un rôle comme le Bûcheron ou l’Homme à la Hache.<br><br>
        Si la majorité vote contre toi au conseil, tu dois révéler ta vraie identité (carte face visible).<br>
        Une fois révélé, tu ne peux plus nommer le maire et tu deviens vulnérable aux votes de jour — tu peux désormais être éliminé comme n’importe quel paysan.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Warning.svg" class="emoji-svg" alt="Attention"> <strong>Orgueil XXL</strong>
        </span><br>
        Tant que ta carte est secrète, tu refuses toute protection nocturne : le Salvateur et autres rôles protecteurs ne peuvent pas te sauver, même s’ils le souhaitent.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Manipule la nomination du maire pour influencer subtilement le jeu, mais reste discret pour ne pas te faire révéler trop tôt.<br>
        - Anticipe le moment inévitable où tu seras exposé et prépare une nouvelle stratégie.<br>
        - Rappelle-toi : être arrogant, oui, mais pas imprudent ! Ton pouvoir disparaît à la première majorité contre toi.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Riche. Arrogant. Imbu de lui-même. Et surtout... intouchable tant qu’il garde son image intacte.<br>
        Pouvoir : Le Pouvoir de l’Argent.<br>
        Tant que sa carte reste face cachée, le Milliardaire peut, chaque nuit, choisir qui sera le maire du village. Il peut changer d’avis autant de fois qu’il le souhaite durant la nuit — après tout, c’est lui qui paie.<br>
        Intouchable ? Oui, mais pas éternellement... Le jour, il ne peut pas mourir, peu importe les votes ou la vengeance d’un rôle de jour (comme le Bûcheron, l’Homme à la Hache, etc.). Mais si la majorité vote contre lui, il doit révéler sa carte. Une fois exposé, il perd son pouvoir de nomination du maire. Et surtout, il devient vulnérable aux votes de jour.<br>
        ⚠️ Orgueil XXL : Le Milliardaire refuse toute forme de protection nocturne tant que sa carte est cachée. Pas question d’être sauvé par un paysan… Même riche, il a des principes.
        `
    },
    {
        id: "LE BIENFAITEUR",
        title: "Le Bienfaiteur",
        image: "le_bienfaiteur.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_bienfaiteur.svg" class="emoji-svg" alt="Bienfaiteur"> <strong>Le Bienfaiteur</strong>
        </span><br>
        Paysan au grand cœur, il veille sur ses voisins, offrant chaque nuit sécurité à l’un d’eux… mais jamais deux fois de suite.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Chaque nuit, tu protèges un joueur de ton choix.<br>
        Ce joueur est immunisé contre toutes les tentatives de meurtre nocturne : rien ne peut le tuer cette nuit-là (loups-garous, sorcière, etc.).<br>
        Tu ne peux pas protéger le même joueur deux nuits de suite : à chaque nuit, il te faut choisir une protection différente.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Varie tes cibles : surveille les rôles importants ou en danger, mais change chaque nuit pour respecter la règle.<br>
        - Reste discret sur tes choix : si ton identité est découverte, les loups-garous pourraient tenter de te neutraliser.<br>
        - Observe les votes et les débats pour anticiper qui a le plus besoin de protection lors de chaque nuit.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Chaque nuit, le Bienfaiteur protège une personne. Cette personne sera protégée et ne pourra donc pas mourir durant la nuit. Le Bienfaiteur ne peut pas protéger la même personne deux nuits de suite.
        `
    },
    {
        id: "LE DÉVOREUR D’ÂMES",
        title: "Le Dévoreur d’Âmes",
        image: "le_devoreur_d_ames.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_devoreur_d_ames.svg" class="emoji-svg" alt="Dévoreur"> <strong>Le Dévoreur d’Âmes</strong>
        </span><br>
        Paysan étrange, il refuse la mort et s’accroche au monde des vivants… quitte à voler la vie (et les pouvoirs) d’un autre.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Lors de ta mort (quelle qu’en soit la cause), tu choisis immédiatement un joueur encore en vie.<br>
        Ce joueur meurt à ta place, et tu demeures en vie.<br>
        Si ce joueur possédait un pouvoir spécial, tu l’obtiens instantanément et tu continues la partie avec ce pouvoir.<br>
        Attention : Tu ne peux utiliser ce détournement qu’une seule fois dans la partie.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Sois stratégique : choisis ta “proie” avec soin, surtout si tu penses qu’elle possède un pouvoir utile.<br>
        - Attention à ne pas révéler ton rôle trop tôt, pour éviter de devenir une cible évidente ou d’être neutralisé avant d’utiliser ton pouvoir.<br>
        - Une fois ton pouvoir utilisé, protège ta nouvelle identité et adapte ton jeu en fonction du pouvoir acquis.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Lorsqu’il meurt, il choisit un joueur encore en vie. Ce joueur meurt à sa place, et si ce dernier possédait un pouvoir spécial, le Dévoreur d’Âmes s’en empare immédiatement. Il ne peut dévorer une âme qu’une seule fois dans la partie.
        `
    },
    {
        id: "LE BUCHERON",
        title: "Le Bûcheron",
        image: "le_bucheron.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_bucheron.svg" class="emoji-svg" alt="Bûcheron"> <strong>Le Bûcheron</strong>
        </span><br>
        Un défenseur impitoyable qui, même dans la mort, frappe fort pour protéger son village.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Dès ta mort, quelle qu’en soit la cause (attaque nocturne des loups-garous ou sorcière, ou élimination durant la journée par les paysans), tu dois désigner immédiatement un joueur qui mourra également sur-le-champ.<br><br>
        Tant que tu es en vie dans la partie, la Petite Fille bénéficie d’une protection : elle ne peut pas mourir.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Choisis ta cible avec soin : ta mort peut avoir un impact décisif.<br>
        - Protège ta propre vie pour garder la protection sur la Petite Fille.<br>
        - Reste vigilant, car les loups voudront sans doute te viser en priorité.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Le Bûcheron, dès qu’il meurt, que ce soit la nuit (tué par les Loups-Garous ou la Sorcière) ou suite à une décision des Paysans, il doit désigner une personne qui mourra également sur-le-champ. Son effet ne s’arrête pas là. Tant que le Bûcheron est en jeu, la Petite Fille ne peut pas mourir.
        `
    },
    {
        id: "LE FOSSOYEUR",
        title: "Le Fossoyeur",
        image: "le_fossoyeur.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_fossoyeur.svg" class="emoji-svg" alt="Fossoyeur"> <strong>Le Fossoyeur</strong>
        </span><br>
        Maître des tombes, il attend son heure pour ressusciter un destin… et s’emparer des pouvoirs des disparus.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Une fois dans la partie, tu peux plonger ta pelle dans la tombe et choisir le rôle d’un joueur déjà éliminé.<br>
        Tu récupères alors tous ses pouvoirs et objectifs : tu deviens ce rôle, en reprenant sa place dans le jeu.<br>
        Tu ne peux utiliser ce pouvoir qu’une seule fois dans la partie → attends le bon moment !<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Plus il y a de morts, plus tu as de choix – patiente pour maximiser ton opportunité.<br>
        - Sois attentif aux pouvoirs utiles dans la fosse, et adapte ta tactique à ta nouvelle identité.<br>
        - Si tu ressuscites un rôle clé, utilise-le rapidement avant d’être démasqué !<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Une fois par partie, le Fossoyeur peut plonger sa pelle dans la tombe… et choisir le rôle d’un joueur déjà éliminé pour le récupérer comme sien. Plus il y a de morts, plus il a de choix… Il ne peut utiliser ce pouvoir qu’une seule fois, alors autant frapper quand la fosse est bien pleine.
        `
    },
    {
        id: "LE VOYANT",
        title: "Le Voyant",
        image: "le_voyant.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_voyant.svg" class="emoji-svg" alt="Voyant"> <strong>Le Voyant</strong>
        </span><br>
        Le prophète du village, capable de lire dans l’âme des joueurs pour révéler amis et ennemis.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Chaque nuit, le Maître du Jeu t’appelle et tu peux découvrir la carte (le rôle exact) d’un joueur de ton choix.<br>
        Ce pouvoir emblématique te permet d’identifier facilement les alliés en qui tu peux avoir confiance, mais surtout de démasquer les ennemis.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Choisis des cibles stratégiques pour maximiser l’impact de ton pouvoir.<br>
        - Partage tes informations avec prudence : trop de révélations pourraient te mettre en danger.<br>
        - Utilise ton pouvoir chaque nuit pour mieux guider le village vers la victoire.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Chaque nuit le Voyant est appelé par le Maître du Jeu et peut découvrir la carte d'un joueur. Le Voyant est un des personnages les plus puissants dans le camp du village. Il pourra facilement identifier des joueurs en qui il pourra avoir confiance, mais surtout l'identité de ses ennemis.
        `
    },
    {
        id: "OLAF ET PILAF",
        title: "Olaf et Pilaf",
        image: "olaf_et_pilaf.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="olaf_et_pilaf.svg" class="emoji-svg" alt="Olaf et Pilaf"> <strong>Olaf et Pilaf</strong>
        </span><br>
        Inséparables paysans, ils tirent leur force de leur duo : ensemble, rien ne peut les atteindre… du moins tant qu’ils sont deux !<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Il existe deux cartes identiques : Olaf et Pilaf.<br><br>
        Au début de la partie, le Maître du Jeu réveille Olaf et Pilaf.<br>
        Ils ouvrent les yeux et se reconnaissent mutuellement.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        Olaf et Pilaf savent qu’ils sont dans le même camp (le village) et qu’ils peuvent se faire totalement confiance.<br>
        Ils ne possèdent aucun pouvoir spécial, mais cette certitude leur permet de s’entraider, partager leurs soupçons et tenter ensemble de démasquer les Loups-Garous.br>
        Attention : ils doivent rester discrets, car révéler leur lien pourrait faire d’eux des cibles prioritaires.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Paysan, cette carte se décline en deux exemplaires identiques. Au début de la partie, le Maître du Jeu réveille Olaf et Pilaf. Ils ouvrent les yeux et se reconnaissent mutuellement. Olaf et Pilaf savent qu’ils sont dans le même camp (le village) et qu’ils peuvent se faire totalement confiance.
        `
    },
    {
        id: "LE MARABOUT",
        title: "Le Marabout",
        image: "le_marabout.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_marabout.svg" class="emoji-svg" alt="Marabout"> <strong>Le Marabout</strong>
        </span><br>
        Paysan mystérieux, il protège avec magie… mais chaque nuit, sa poupée vaudou sème protection et paralysie dans les rangs.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir — La Poupée Vaudou</strong>
        </span><br>
        Chaque nuit, tu places ta poupée vaudou chez un joueur de ton choix.<br>
        Ce joueur est protégé de toutes les attaques nocturnes (loups-garous, sorcière, etc.), rien ne peut le tuer ou le perturber cette nuit-là.<br>
        Mais : la capacité spéciale de nuit de ce joueur est bloquée cette nuit-là.<br>
        <br><br>
        
        <span style="font-size:1.2em;">
            <img src="Skull.svg" class="emoji-svg" alt="Mort"> <strong>Effet secondaire</strong>
        </span><br>
        Si le joueur qui possède la poupée meurt pendant la journée, la poupée est détruite (bûcher populaire) et tu perds définitivement ton pouvoir.<br>
        Si le Marabout meurt pendant la partie, la poupée meurt aussi et la protection disparaît.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Choisis ta cible avec prudence : protège les alliances, mais ne bloque pas trop de pouvoirs utiles au village.<br>
        - Bouge ta poupée souvent et subtilement pour éviter qu’elle soit découverte ou compromise.<br>
        - Pense à placer ta magie loin des joueurs en danger… ou de ceux susceptibles d’être éliminés au conseil.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Pouvoir : La Poupée Vaudou<br>
        Chaque nuit, le Marabout place sa poupée vaudou chez un joueur. Ce joueur est protégé des attaques nocturnes. Rien ne passe. Même pas un mauvais rêve. MAIS… sa capacité de nuit est bloquée.<br>
        ☠️ Effet secondaire : Si le joueur en possession de la poupée meurt pendant la journée, la poupée est détruite dans les flammes du bûcher populaire. Le Marabout perd alors définitivement son pouvoir. Si le Marabout meurt, la poupée meurt aussi.<br>
        💡 Moralité : bouge ta poupée, souvent, subtilement, et idéalement loin des joueurs en danger.
        `
    },
    {
        id: "LE DETECTIVE",
        title: "Le Détective",
        image: "le_detective.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_detective.svg" class="emoji-svg" alt="Détective"> <strong>Le Détective</strong>
        </span><br>
        Un observateur solitaire, il n’a de compte à rendre à personne. Son instinct aiguisé et sa patience font de lui un adversaire redoutable… ou une cible facile.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à éliminer les loups-garous en résolvant l’énigme ultime.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés, et où si tu identifies parfaitement tous les rôles autour de la table la partie s'arrête.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Au moment de son enquête, tu peux choisir de révéler publiquement l’identité exacte de chaque joueur en vie.<br>
        S’il ne fait aucune erreur dans son analyse, il remporte la partie immédiatement avec son camp.<br>
        S’il commet la moindre erreur, il meurt sur-le-champ.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Observe attentivement les discussions, comportements et alliances avant de te lancer.<br>
        - Attends qu’il reste peu de joueurs pour augmenter tes chances de réussite.<br>
        - Reste prudent : révéler ton rôle trop tôt te rend vulnérable.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Le Détective est un rôle compliqué à optimiser, il ne doit rien à personne. Il écoute attentivement, théorise, suppute, puis, à un moment donné, il se lance et révèle l’identité de chaque joueur autour de la table. S’il fait un sans-faute, il remporte immédiatement la partie lui et son camp. En revanche, s’il commet la moindre erreur, il meurt sur-le-champ. (Moins il y a de joueurs en jeu, plus son enquête sera facile.)
        `
    },
    {
        id: "LE CHAT",
        title: "Le Chat",
        image: "le_chat.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_chat.svg" class="emoji-svg" alt="Chat"> <strong>Le Chat</strong>
        </span><br>
        Mystérieux félin du village, il glisse dans l’ombre chaque nuit pour donner du poids à une voix humaine — parfois celle d’un allié, parfois celle d’un inconnu.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Chaque nuit, tu désignes discrètement un joueur.<br>
        Le lendemain, la voix de ce joueur comptera double lors du vote du jour.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Utilise ton pouvoir pour renforcer le poids d’un allié ou semer la confusion chez les adversaires.<br>
        - Reste discret sur tes choix nocturnes afin de ne pas te faire repérer par les loups-garous.<br>
        - Analyse les débats pour choisir la bonne personne au bon moment.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Chaque nuit, ce mystérieux félin s’étire, puis désigne en toute discrétion un joueur. Le lendemain, la voix de cette personne comptera double lors du vote de jour.
        `
    },
    {
        
        id: "L’IVROGNE",
        title: "L’Ivrogne",
        image: "l_ivrogne.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="l_ivrogne.svg" class="emoji-svg" alt="Ivrogne"> <strong>L’Ivrogne</strong>
        </span><br>
        Joueur imprévisible, il trouve sa véritable identité à la troisième nuit... et peut changer la partie à lui seul.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Atteindre la troisième nuit pour enfin faire basculer la partie.<br>
        Tu gagnes avec le camp correspondant au rôle que tu auras choisi.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Jusqu’à la troisième nuit, tu ignores ton propre rôle et ne profites d’aucun pouvoir.<br>
        Lors de la troisième nuit, le narrateur t’appelle et tu choisis alors le rôle de ton choix parmi tous les rôles du jeu (restants ou déjà éliminés, selon la règle de ta table).<br>
        À partir de ce moment, tu adoptes ce rôle, son but et ses pouvoirs, et tu poursuis la partie normalement.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Sois attentif aux dynamiques du village et reste discret en début de partie pour survivre jusqu’à la troisième nuit.<br>
        - Observe quels rôles semblent absents ou menacés avant de choisir.<br>
        - Ton timing et ton choix de rôle peuvent bouleverser l’équilibre de la partie, alors réfléchis bien !<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        L’ivrogne est un personnage clé de la partie. Il ignore son propre rôle jusqu’à la troisième nuit. Son jeu commence au moment précis où le narrateur l’appelle lors de la troisième nuit, et lui demande de choisir le rôle de son choix parmi n'importe quel rôle du jeu.
        `
    },
    {
        id: "LE PETIT RIGOLO",
        title: "Le Petit Rigolo",
        image: "le_petit_rigolo.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_petit_rigolo.svg" class="emoji-svg" alt="Rigolo"> <strong>Le Petit Rigolo</strong>
        </span><br>
        Lors de la première nuit, le Maître du Jeu réveille le Petit Rigolo. Il désigne un joueur de son choix..<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à démasquer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        À partir de ce moment, le Petit Rigolo doit s’acharner publiquement sur ce joueur :<br>
        à chaque vote de jour,<br>
        quoi qu’il arrive,<br>
        il est obligé de voter contre cette personne.<br>
        Il ne peut jamais changer d’avis, même s’il doute ou si la situation devient suspecte.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        Si le joueur désigné par le Petit Rigolo meurt (de jour), alors le Petit Rigolo devient intouchable pendant les votes du jour<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        La première nuit, le Petit Rigolo désigne un joueur. Dès le lendemain et chaque jour, il doit obligatoirement voter contre cette personne, sans jamais changer d’avis. Si le joueur désigné meurt, (de jour) alors le Petit Rigolo devient immunisé contre les votes du village : il ne pourra plus jamais être éliminé de jour.
        `
    },
    {
        id: "UCHRONIE",
        title: "Uchronie",
        image: "uchronie.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="uchronie.svg" class="emoji-svg" alt="Uchronie"> <strong>Uchronie</strong>
        </span><br>
        Voyageur interdimensionnel, capable d’offrir au village une seconde chance… si le temps veut bien tourner en sa faveur.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à éliminer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Une fois dans la partie, lors d’un vote de jour, juste avant que le Maître du Jeu ne révèle le rôle du joueur éliminé, le MJ endort le village et te demande si tu veux remonter le temps :<br><br>
        Si tu acceptes, le MJ te montre secrètement le rôle du joueur qui allait être éliminé.<br>
        La journée est alors entièrement rejouée comme si rien ne s'était passé : débat, défense, nouveau vote.<br>
        Tu peux utiliser l’information obtenue pour influencer ou anticiper la défense ou l’accusation du joueur en question.<br>
        Après ta deuxième utilisation de ce pouvoir, tu deviens un simple paysan.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Utilise ton pouvoir uniquement quand le vote est vraiment décisif ou incertain.<br>
        - Une bonne utilisation peut sauver le village ou inverser une erreur fatale !<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Uchronie est un voyageur interdimensionnel capable de créer une réalité alternative… à condition de convaincre le village de ne pas refaire deux fois la même erreur. Lors des votes du village, Uchronie peut stopper le temps juste avant que le MJ ne révèle le rôle du joueur éliminé : le MJ endort le village et demande à Uchronie s’il veut utiliser son pouvoir et remonter le temps. À cet instant, le MJ lui montre secrètement le rôle du joueur sur le point de mourir, puis la journée est entièrement rejouée comme si rien ne s'était passé. Uchronie peut tenter de modifier le cours des événements en anticipant la défense du joueur éliminé ou en l’enfonçant si la carte qu’il a vue confirme ses soupçons.<br>
        Uchronie peut utiliser une fois sa capacité spéciale dans toute la partie. Après son utilisation, il devient un paysan sans aucun pouvoir.
        `
    },
    {
        id: "LE CLODO",
        title: "Le Clodo",
        image: "le_clodo.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_clodo.svg" class="emoji-svg" alt="Clodo"> <strong>Le Clodo</strong>
        </span><br>
        Invisible à force d’être ignoré, il fouille la nuit dans les secrets des autres… mais gare à ceux qui ont les crocs !<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et aider les paysans à éliminer les loups-garous.<br>
        Tu gagnes si tous les loups-garous (et, le cas échéant, tous les rôles solos) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Trois fois par partie, pendant la nuit, tu peux “faire les poubelles sociales” : fouille discrètement les poches d’un autre joueur.<br>
        Si la cible possède un rôle actif (Voyant, Sorcière, Bienfaiteur, etc.), tu lui “empruntes” ce rôle pour la nuit : tu utilises son pouvoir à sa place, tandis que lui/elle est neutralisé(e) cette nuit-là.<br>
        Le Maître du Jeu t’indique secrètement le pouvoir récupéré, et touche la tête de la victime pour signaler qu’elle a été détroussée.<br>
        Si tu tentes de détrousser un loup-garou, tu es immédiatement démasqué : tu deviens un simple paysan pour le reste de la partie, sans aucun pouvoir.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Choisis tes cibles avec finesse : vise ceux qui semblent disposer d’un rôle actif intéressant.<br>
        - Varie tes cibles ; évite les suspects de lycanthropie pour ne pas perdre tout d’un coup !<br>
        - Utilise chaque vol à un moment stratégique, car tu n’en as que trois par partie.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Trois fois dans la partie, le Clodo peut, pendant la nuit, fouiller discrètement les poches d’un joueur (“faire les poubelles sociales”). Si la cible a un rôle actif (Voyant, Sorcière, Bienfaiteur, etc.), le Clodo lui "emprunte" ce rôle pour la nuit. Le Maître du Jeu informe discrètement le Clodo de ce qu’il a récupéré, et touche subtilement la tête de la victime pour lui signifier qu’elle a été détroussée (son pouvoir est neutralisé pour cette nuit-là).<br>
        ⚠️ Si le Clodo tente de faire les poches d’un Loup-Garou, c’est la clodo-fin : il devient un simple paysan et perd son pouvoir pour le reste de la partie.
        `
    },
    {
        id: "LE LOUP-GAROU",
        title: "Le Loup-Garou",
        image: "le_loup_garou.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_loup_garou.svg" class="emoji-svg" alt="Loup-Garou"> <strong>Le Loup-Garou</strong>
        </span><br>
        Prédateur de la nuit, il traque les paysans dans l’ombre et tisse la peur autour de lui.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et éliminer tous les paysans.<br>
        Tu gagnes si tous les paysans (rôles solos spéciaux) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Tu fais partie de la meute, et tu connais l’identité des autres loups-garous.<br>
        Chaque nuit, vous vous réunissez secrètement pour choisir une victime parmi les paysans.<br>
        Votre but est de réduire le village jusqu’à ce qu’il ne reste plus que des loups.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Collabore étroitement avec tes compagnons loups : la coordination est essentielle.<br>
        - Gagne la confiance du village le jour tout en évitant de lever des soupçons.<br>
        - Choisis vos victimes stratégiquement : éliminer les rôles dangereux en priorité peut vous sauver la peau.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Le loup-garou incarne l'un des rôles de l'équipe des loups-garous. Il connaît l'identité des autres loups-garous et doit essayer de tuer tous les paysans sans se faire découvrir. Il se réunit chaque nuit avec les autres loups-garous pour décider de leur victime. Il gagne si tout le village est éliminé.
        `
    },
    {
        id: "LE LOUP-GAROU ROUGE",
        title: "Le Loup-Garou Rouge",
        image: "le_loup_garou_rouge.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_loup_garou_rouge.svg" class="emoji-svg" alt="Rouge"> <strong>Le Loup-Garou Rouge</strong>
        </span><br>
        Le plus coriace de la meute, mais fragile dans son secret, il lie sa vie à celle d’un autre.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et éliminer tous les paysans.<br>
        Tu gagnes si tous les paysans (rôles solos spéciaux) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        tu es appelé seul en premier la premiere nuit, avant les autres loups-garous.<br>
        Tu choisis un joueur (loup ou paysan) à qui tu donnes ton cœur.<br>
        Tant que ce joueur est en vie, tu es immortel : aucune attaque ne peut te tuer.<br>
        Si ce joueur meurt, tu redeviens vulnérable.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Choisis ta personne avec soin : un allié fiable est un bouclier vivant.<br>
        - Camoufle ta nature : essaie que ton “cœur” soit une cible dure à éliminer pour le village.<br>
        - Communique avec la meute pour optimiser vos stratégies.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Le Loup-Garou Rouge est le plus coriace des loups, mais aussi le plus fragile. Il est appelé seul en premier la première nuit et donne son cœur au joueur de son choix. Tant que ce joueur est en vie, le Loup-Garou Rouge est immortel.
        `
    },
    {
        id: "LE LOUP-GAROU MAUDIT",
        title: "Le Loup-Garou Maudit",
        image: "le_loup_garou_maudit.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_loup_garou_maudit.svg" class="emoji-svg" alt="Maudit"> <strong>Le Loup-Garou Maudit</strong>
        </span><br>
        Né sous une lune de sang, il vit comme un humain… jusqu’à ce qu’un drame réveille la bête en lui.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et éliminer tous les paysans.<br>
        Tu gagnes si tous les paysans (rôles solos spéciaux.) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Il est le seul Loup-Garou qui ne se réveille jamais avec la meute. Les autres Loups ne savent pas qui il est.<br>
        <strong>Malédiction</strong> : Au début de la partie, le Loup-Garou Maudit choisit deux joueurs.<br>
        <strong>Transformation</strong> : Ces joueurs représentent ses chaînes.<br>
        Tant qu’au moins un des deux est en vie : le Loup-Garou Maudit est enchaîné, il ne peut pas attaquer et n’est pas appelé la nuit. <br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        Si les deux joueurs meurent au cours de la partie :<br>
        le Loup-Garou Maudit est libéré.<br>
        il est désormais appelé seul la nuit.<br>
        et peut manger un joueur de son côté.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Maudit dès sa naissance, ce loup ne chasse pas avec la meute. Il fait partie de l’équipe des Loups Garous et gagne avec eux, sans connaître leur identité. Au début de la partie, il lie son destin à deux joueurs, ses chaînes. Tant qu’au moins l’un d’eux est en vie, il reste enchaîné, incapable d’attaquer et non appelé la nuit. indétectable tant qu'il est enchainer. Lorsque ses deux chaînes meurent, la malédiction se brise. Le Loup-Garou Maudit est alors appelé seul la nuit et peut éliminer un joueur. ⚠️ Attention : Ne connaissant pas l’existence ni l’identité des autres Loups-Garous, ses éliminations nocturnes sont risquées et peuvent affaiblir son propre camp.
        `
    },
    {
        id: "LE LOUP-GAROU ALPHA",
        title: "Le Loup-Garou Alpha",
        image: "le_loup_garou_alpha.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_loup_garou_alpha.svg" class="emoji-svg" alt="Alpha"> <strong>Le Loup-Garou Alpha</strong>
        </span><br>
        Chef charismatique et manipulateur, il a le don d’offrir à d’autres la tentation de devenir loup… mais une seule fois dans sa vie nocturne.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et éliminer tous les paysans.<br>
        Tu gagnes si tous les paysans (rôles solos spéciaux.) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir – Offre Irrésistible</strong>
        </span><br>
        Une seule fois dans la partie, pendant la nuit, tu peux désigner en secret une cible pour rejoindre la meute.<br>
        Le Maître du Jeu s’en souvient, puis réveille tout le village au matin :<br>
        “Le Loup-Garou Alpha a jeté son dévolu sur toi…”<br>
        La nuit suivante, le joueur désigné devra choisir :<br>
        - Accepter : il ouvre les yeux pendant la phase nocturne et rejoint les loups-garous, participant désormais aux attaques et à la victoire de la meute.<br>
        - Refuser : il garde les yeux fermés et l’offre expire pour de bon. Tu ne peux plus tenter de recruter qui que ce soit.<br>
        Attention : une seule tentative, une seule cible possible dans toute la partie.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Choisis ta cible au bon moment : repère un rôle influent, hésitant ou un joueur isolé qui aurait intérêt à changer de camp.<br>
        - Rappelle-toi : certains joueurs peuvent refuser, ton choix doit donc être réfléchi !<br>
        - Cette capacité peut retourner une fin de partie si elle est utilisée au meilleur moment.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Contrairement à ses compères velus, l’Alpha sait manier la courtoisie… à sa manière. Une fois par partie, il peut faire une offre “irrésistible” à un joueur de son choix pour rejoindre la meute. Lors de la nuit, l’Alpha désigne secrètement sa cible, puis se rendort paisiblement. Le Maître du Jeu réveille ensuite le village au matin et indique : “Le Loup-Garou Alpha a jeté son dévolu sur toi…” La nuit suivante, le joueur cible devra choisir s’il accepte ou refuse l’offre. Accepter : il rejoint alors les loups-garous et joue avec eux. Refuser : il reste dans son camp, et l’offre ne pourra plus jamais être faite à personne. L’Alpha n’a droit qu’à une seule tentative.
        `
    },
    {
        id: "LOUP-GAROU VOYANT",
        title: "Loup-Garou Voyant",
        image: "loup_garou_voyant.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="loup_garou_voyant.svg" class="emoji-svg" alt="LG Voyant"> <strong>Loup-Garou Voyant</strong>
        </span><br>
        Prédateur à l’œil perçant, il partage les secrets du camp des loups et la prescience du voyant : une vraie menace pour le village.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et éliminer tous les paysans.<br>
        Tu gagnes si tous les paysans (rôles solos spéciaux.) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Chaque nuit, tu te réunis avec la meute des loups-garous pour choisir une victime.<br>
        En plus, à chaque nuit, tu peux découvrir en secret le rôle exact d’un joueur de ton choix, comme le Voyant.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Utilise ton pouvoir pour cibler en priorité les rôles-clés du village (Voyant, Sorcière, Bienfaiteur, etc.).<br>
        - Partage discrètement tes découvertes avec la meute pour mener des attaques efficaces.<br>
        - Reste prudent en journée : trop bien viser pourrait éveiller les soupçons du village.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Le Loup-Garou Voyant possède la double capacité de manger avec la meute et de voir comme le Voyant chaque nuit. Il est l’arme ultime du côté des Loups : chaque nuit, il découvre le rôle d’un joueur de son choix, puis participe à la désignation de la victime avec les autres loups-garous.
        `
    },
    {
        id: "LE LOUP GAROU BAVARD",
        title: "Le Loup-Garou Bavard",
        image: "le_loup_garou_bavard.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_loup_garou_bavard.svg" class="emoji-svg" alt="Bavard"> <strong>Le Loup-Garou Bavard</strong>
        </span><br>
        Dans la meute, il a la langue plus affûtée que les crocs. Mais à force de trop parler, il risque de s’attirer des ennuis…<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et éliminer tous les paysans.<br>
        Tu gagnes si tous les paysans (rôles solos spéciaux.) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir (ou malédiction ?) : Langue bien pendue</strong>
        </span><br>
        Chaque jour, entre le réveil du village et la fin des votes, tu dois obligatoirement dire la phrase magique que le MJ t’a montrée cette nuit.<br>
        Le Maître du Jeu doit clairement t’entendre.<br>
        Si tu ne le fais pas, ou si tu es trop discret, tu meurs mystérieusement à la fin de la journée.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Place la phrase de façon naturelle dans la conversation pour ne pas trop éveiller les soupçons.<br>
        - Ne force pas trop : trop insister peut aussi te mettre en danger.<br>
        - Reste vigilant : cette contrainte peut être un piège si le village devient attentif à ce détail.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Ce Loup-Garou chasse avec la meute, comme les autres. Mais chaque nuit, après l’attaque collective, il est appelé seul par le Maître du Jeu. Le MJ lui montre alors une phrase, qui peut avoir du sens… ou pas. Le lendemain, le Loup-Garou Bavard doit glisser cette phrase dans les discussions du village, à n’importe quel moment de la journée. S’il ne le fait pas, il est éliminé. Parler trop peut le trahir. Se taire lui est fatal.
        `
    },
    {
        id: "LE LOUP GAROU FAINEANT",
        title: "Le Loup-Garou Fainéant",
        image: "le_loup_garou_faineant.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_loup_garou_faineant.svg" class="emoji-svg" alt="Fainéant"> <strong>Le Loup-Garou Fainéant</strong>
        </span><br>
        Sa vraie passion, c’est la sieste. Mais gare à ceux qui réveillent la bête qui dort…<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et éliminer tous les paysans.<br>
        Tu gagnes si tous les paysans (rôles solos spéciaux.) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Début de partie : tu ignores qui sont les autres loups-garous et tu ne participes pas aux réunions nocturnes.<br>
        Dès qu’un Loup-Garou est éliminé (peu importe la cause), tu te réveilles lors de la prochaine nuit.<br>
        Cette nuit-là, tu découvres qui sont tes alliés loups encore vivants, et rejoins leur équipe.<br>
        À partir de ce moment, tu agis comme tous les loups-garous : tu complotes et participes aux attaques chaque nuit.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Fais profil bas en début de partie pour éviter d’attirer l’attention.<br>
        - Une fois réveillé, mets à profit ta fraîcheur et la surprise stratégique pour aider la meute.<br>
        - Ta transformation tardive peut déséquilibrer le jeu : choisis bien tes alliés et tes stratégies !<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Dormir, c’est sa grande passion. Comploter ? Trop fatiguant. Mais attention… quand un copain loup tombe, il se réveille enfin. Au début de la partie, le Loup-Garou Fainéant ne connaît son équipe. Il ne se réveille pas avec les autres loups pendant la phase de nuit. Mais, dès qu’un Loup-Garou meurt, ce paresseux se réveille lors de la prochaine nuit, découvre enfin qui sont ses alliés encore vivants, et rejoint la meute. À partir de là, il participe aux attaques et peut devenir un stratège redoutable.
        `
    },
    {
        id: "LE PAPA DES LOUPS",
        title: "Le Papa des Loups",
        image: "le_papa_des_loups.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_papa_des_loups.svg" class="emoji-svg" alt="Papa Loup"> <strong>Le Papa des Loups</strong>
        </span><br>
        Chef de meute, il sème la discorde en donnant la morsure de la transformation… et agrandit la famille des loups-garous.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et éliminer tous les paysans.<br>
        Tu gagnes si tous les paysans (rôles solos spéciaux.) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir — Infection</strong>
        </span><br>
        Chaque nuit, tu participes à la décision de la meute pour désigner la victime.<br>
        Une fois dans la partie, tu peux choisir en secret un paysan à infecter : ce joueur se transforme alors en loup-garou et rejoint la meute.<br>
        L'infection peut bouleverser la partie si elle cible quelqu’un d’important ou de bien intégré chez les paysans.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Utilise ton pouvoir d’infection au bon moment, idéalement sur un rôle-clé ou un joueur en difficulté pour semer le doute.<br>
        - Garde l’apparence d’un loup classique pour ne pas attirer l’attention excessive.<br>
        - Une infection bien placée peut retourner une partie mal engagée pour les loups-garous.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Le Papa des Loups détient un pouvoir unique et sinistre, capable de semer la discorde et le doute au sein du village. Dans l'équipe des loups-garous, il joue un rôle crucial. En plus de participer aux décisions nocturnes pour éliminer les paysans, il possède un pouvoir particulier : celui d'infecter un paysan une fois dans la partie, le transformant en loup-garou.
        `
    },
    {
        id: "L'ENFANT LOUP-GAROU",
        title: "L’Enfant Loup-Garou",
        image: "l_enfant_loup_garou.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="l_enfant_loup_garou.svg" class="emoji-svg" alt="Enfant Loup"> <strong>L’Enfant Loup-Garou</strong>
        </span><br>
        Doux en apparence, mais redoutable en secret : impossible à percer à jour, il sème le doute et la terreur au sein du village.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et éliminer tous les paysans.<br>
        Tu gagnes si tous les paysans (rôles solos spéciaux.) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir — Indétectable</strong>
        </span><br>
        Aux yeux des paysan et même des rôles spéciaux comme (Voyant, Cerbere, etc.), tu apparais toujours comme un simple paysan.<br>
        Aucun test, pouvoir défensif ou capacité de contrôle ne peut révéler ta vraie nature de loup-garou.<br>
        Tu participes aux réunions nocturnes comme tous les loups, mais restes absolument indétectable de jour.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Profite de ton anonymat pour influencer les votes et semer la confusion.<br>
        - Utilise ta protection pour t’imposer dans les débats sans crainte d’être démasqué.<br>
        - Prends garde à ne pas trop attirer l’attention, car un échec pourrait inciter le village à voter contre toi malgré tout.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Il a l’air doux, fragile… presque inoffensif. Et pourtant. L’Enfant Loup-Garou est indétectable : Aux yeux des paysans, c’est un paysan comme les autres. Il passe tous les tests, résiste à toutes les vérifications. Même les meilleurs rôles défensifs ou les pouvoirs de contrôle ne voient que du feu.
        `
    },
    {
        id: "LE LOUP-GAROU DE LA BRUME",
        title: "Le Loup-Garou de la Brume",
        image: "le_loup_garou_de_la_brume.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_loup_garou.svg" class="emoji-svg" alt="Loup Brume"> <strong>Le Loup-Garou de la Brume</strong>
        </span><br>
        <em>Une ombre parmi les ombres, il frappe quand on ne voit plus rien.</em><br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et éliminer tous les paysans.<br>
        Tu gagnes si tous les paysans (rôles solos spéciaux.) sont éliminés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir — Évanescence</strong>
        </span><br>
        Chaque nuit, il se réveille en même temps que les autres loups et participe normalement à leur action collective.<br>
        Une fois cette phase terminée, il est appelé séparément pour utiliser son pouvoir.<br>
        Son pouvoir lui permet de « Brumer » un joueur.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        Un joueur brumé voit toutes ses actions de la nuit devenir aléatoires :.<br>
         au lieu d’atteindre la cible choisie, ses actions s’appliqueront à une autre personne tirée au hasard, y compris le Loup des Brumes lui-même.<br>
        Le hasard est déterminé par le Maître du Jeu, qui lance un dé pour désigner la nouvelle cible parmi les joueurs éligibles.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Le Loup des Brumes est une ombre parmi les loups-garous, Chaque nuit, il se réveille en même temps que les autres loups et participe normalement à leur action collective. Une fois cette phase terminée, il est appelé séparément pour utiliser son pouvoir. Son pouvoir lui permet de « Brumer » un joueur. Un joueur brumé voit toutes ses actions de la nuit devenir aléatoires : au lieu d’atteindre la cible choisie, ses actions s’appliqueront à une autre personne tirée au hasard, y compris le Loup des Brumes lui-même. Le hasard est déterminé par le Maître du Jeu, qui lance un dé pour désigner la nouvelle cible parmi les joueurs éligibles.
        `
    },
    {
        id: "LA BÊTE IMMONDE",
        title: "La Bête Immonde",
        image: "la_bete_immonde.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="la_bete_immonde.svg" class="emoji-svg" alt="Bête"> <strong>La Bête Immonde</strong>
        </span><br>
        Sauvage, incontrôlable, solitaire : le cauchemar des Loups… et la hantise du village.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et éliminer tous les loups-garous par toi-même.<br>
        Tu gagnes la partie si tous les loups-garous sont morts et que tu es encore en vie à la fin.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Chaque nuit, tu peux désigner un joueur à attaquer :<br>
        Si c’est un loup-garou, il est immédiatement éliminé.<br>
        Si c’est un paysan (ou non-loup), il ne se passe rien : tu as simplement perdu un tour.<br>
        Tu joues seul contre tous : ni l’équipe du village, ni les loups-garous ne sont tes alliés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Observe bien les débats et les comportements pour repérer les loups.<br>
        - Ne dévoile jamais ton identité trop tôt : les deux camps pourraient vite s’allier pour t’éliminer.<br>
        - Patiente : chaque attaque ratée te coûte cher, mais une victime bien choisie te rapproche de la victoire.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Le cauchemar des Loups, enfin de la partie ! Cette Bête Immonde est seule contre le reste du monde. Son objectif est simple : manger un Loup chaque nuit. Si la Bête Immonde désigne un paysan au lieu d'un Loup, il ne se passe rien ; la Bête aura simplement perdu un tour. Lorsque tous les Loups sont éliminés et que la Bête Immonde est toujours en jeu, elle gagne fin de partie. À un moment ou à un autre, les Loups devront faire alliance avec le Village pour débusquer cette abomination et éviter la victoire prématurée de la Bête, au détriment d'un camp comme de l'autre.
        `
    },
    {
        
        id: "L'AVOCAT DU DIABLE",
        title: "L’Avocat du Diable",
        image: "l_avocat_du_diable.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="l_avocat_du_diable.svg" class="emoji-svg" alt="Avocat"> <strong>L’Avocat du Diable</strong>
        </span><br>
        Ni Bien, ni Mal : il plaide au gré du vent et fait trembler la balance du destin. Son arme : l’influence absolue sur le jugement du village.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Gagner avec le camp de ton choix – village, loups, ou autre, selon la tournure de la partie.<br>
        Tu gagnes avec le groupe majoritaire.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir — Trio du Jugement</strong>
        </span><br>
        Chaque nuit, tant que tu es vivant, tu désignes trois joueurs : ton trio du jugement.<br>
        Au lever du jour, le Maître du Jeu annonce : « Aujourd’hui, le village devra choisir entre [Nom1], [Nom2], et [Nom3]. »<br>
        Durant cette journée, seuls ces trois joueurs peuvent être votés et risquent le bûcher.<br>
        À chaque nuit suivante, tu peux reformer un nouveau trio ou garder le même, selon ta stratégie et tes envies.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Utilise ton influence pour diriger le jeu dans le sens qui te plaît.<br>
        - Garde ton objectif flou auprès des autres : ton pouvoir te permet de rester imprévisible.<br>
        - Bouscule les alliances à ton avantage, et choisis ton camp quand le moment est venu.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Le crime n’existe pas sans preuve… mais les preuves, lui, il les invente. L’Avocat du Diable ne croit ni au Bien, ni au Mal. Il plaide pour qui il veut, selon son humeur ou son intérêt. Chaque nuit, tant qu’il est en vie, il se réveille et désigne trois joueurs : son trio du jugement. Au lever du jour, le Maître du Jeu annonce : « Aujourd’hui, le village devra choisir entre [Nom 1], [Nom 2] et [Nom 3]. » Durant cette journée, seuls ces trois joueurs peuvent être votés par le village. Le bûcher devra en emporter un… que l’Avocat aura, d’une certaine manière, choisi. Chaque nuit suivante, il peut reformer un nouveau trio, ou conserver le même selon sa stratégie. L’Avocat du Diable n’appartient à aucun camp : ni au village, ni aux loups, ni à quiconque. Il gagne avec qui il veut, selon la tournure de la partie. Son véritable pouvoir, c’est l’influence.
        `
    },
    {
        id: "LA VALKYRIE",
        title: "La Valkyrie",
        image: "la_valkyrie.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="la_valkyrie.svg" class="emoji-svg" alt="Valkyrie"> <strong>La Valkyrie</strong>
        </span><br>
        Guerrière solitaire parmi les humains, elle cherche une chute glorieuse… ou finit simple mortelle comme les autres.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Être éliminée par le vote du village au premier tour, ou par le maire.<br>
        Si tu réussis, tu remportes immédiatement la partie en tant que Valkyrie, seule.<br>
        Si tu survis au premier vote, tu perds ton pouvoir et deviens Simple paysanne à la poursuite des loups-garous pour le reste de la partie.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Lors du tout premier tour (premier vote du village), ton objectif est d’être tuée par le bûcher.<br>
        Si tu y parviens, tu gagnes immédiatement – la victoire de la Valkyrie annule la partie pour tous les autres.<br>
        Si tu échoues à te faire tuer, tu perds toute capacité spéciale : tu continues la partie comme une Simple paysanne, sans but ou pouvoir personnel.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Attire habilement l’attention sur toi dès les premières minutes sans éveiller trop de soupçons sur ton véritable rôle.<br>
        - Multiplie les provocations, contradictions, ou maladresses… mais attention de ne pas en faire trop : le village pourrait hésiter à t’éliminer.<br>
        - Prépare un plan de secours : si tu survis, adapte ton jeu à celui d’un paysan classique.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Il s'agit d'un rôle presque "obligatoire" à placer durant les parties avec de nombreux joueurs, car le premier vote est très réfléchi et oblige les joueurs à se concentrer. Du point de vue de La Valkyrie, son but est de se faire tuer dès le premier tour, elle n'a donc que l'embarras du choix des moyens de se faire tuer. Si La Valkyrie ne réussit pas à se faire tuer, elle devient Simple paysanne pour le reste de la partie.
        `
    },
    {
        id: "LE CLOWN",
        title: "Le Clown",
        image: "le_clown.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_clown.svg" class="emoji-svg" alt="Clown"> <strong>Le Clown</strong>
        </span><br>
        “Lorsqu’un clown entre dans un village, il ne devient pas roi de ce village, c’est le village qui devient un cirque.”<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre.<br>
        Tu gagnes si tu restes en vie jusqu’à ce que l’un des deux camps (loups ou paysans) soit complètement décimé.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Immunité nocturne : si tu es ciblé la nuit, cette personne meurt instantanément (peu importe qui tente de t’atteindre).<br>
        Le seul moyen pour les autres de t’éliminer est par un vote du village en journée.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Sois discret sur ton identité pour éviter de devenir une cible de jour.<br>
        - Développe des stratégies pour manipuler les soupçons et détourner les pouvoirs de nuit loin de toi.<br>
        - Prépare-toi à te défendre lors des votes de jour, le seul vrai danger pour toi.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        "Lorsqu’un clown entre dans un village, il ne devient pas roi de ce village, c’est le village qui devient un cirque.” (Proverbe turc)<br>
        Le clown ne doit en aucun cas être la cible de qui que ce soit la nuit, sous peine que cette personne meure instantanément. Le seul moyen d’en venir à bout est de le désigner lors du vote en journée.
        `
    },
    {
        id: "LE DIABLE",
        title: "Le Diable",
        image: "le_diable.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_diable.svg" class="emoji-svg" alt="Diable"> <strong>Le Diable</strong>
        </span><br>
        Maître de la tentation et du chaos : il double le danger des pouvoirs… et double ses chances de victoire.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Choisir son camp selon la tournure de la partie.<br>
        Tu gagnes avec les paysans ou les loups-garous, tant que tu es encore en vie à la fin.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir — Doubleur de pouvoirs</strong>
        </span><br>
        Chaque nuit, certains rôles peuvent demander à voir le Diable pour formuler un souhait.<br><br>
        Exemples :<br>
        Si le diable accepte le Bienfaiteur, il peut protéger deux personnes cette nuit.<br>
        Si le diable accepte Loup-Garou, le loup en question pourra manger deux fois cette nuit.<br>
        Si le diable accepte la Sorcière, elle pourra  récupérer ses potions utiliser.<br>
        Le jour, si le rôle possède un pouvoir diurne, le diable renforce.<br>
        Exemple : si le Bûcheron est éliminé ce jour-là, il emporte deux personnes dans sa chute, au lieu d’une seule.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        ⚠️ Libre arbitre du Diable :<br>
        Le Diable n’est jamais obligé d’accepter une demande.<br>
        Il peut :<br>
        toutes les refuser.<br>
        toutes les accepter<br>
        ou n’en accepter qu’une seule<br>
        🎲 Le prix à payer :
        Pour chaque demande acceptée, le Diable lance un dé.<br>
        Chiffre pair → le joueur obtient son souhait.<br>
        Chiffre impair → le joueur meurt immédiatement.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Le Diable est un rôle à part. Il peut jouer avec le village, avec les Loups-Garous, ou en solo : 😈 Révélation publique : Dès le début de la partie, le Diable est connu de tous. Le MJ lui demande de se révéler publiquement. 
        🔮 Les souhaits : Chaque nuit, certains rôles peuvent demander à voir le Diable pour formuler un souhait. Tous les rôles ne peuvent pas le faire (la liste est décidée par le MJ). 
        Exemples de souhaits possibles : Sorcière : récupérer ses potions (sans doublon) Voyante : regarder deux joueurs la même nuit (uniquement ce tour) Paysan : obtenir une protection nocturne pour la nuit suivante 
        ⚠️ Libre arbitre du Diable : Le Diable n’est jamais obligé d’accepter une demande. Il peut : toutes les refuser toutes les accepter ou n’en accepter qu’une seule 
        🎲 Le prix à payer : Pour chaque demande acceptée, le Diable lance un dé : Chiffre pair → le joueur obtient son souhait Chiffre impair → le joueur meurt immédiatement 
        🌙 Déroulement la nuit : Les rôles nocturnes jouent normalement Avant le réveil du village, le MJ demande : « Qui souhaite voir le Diable ? » Les joueurs lèvent la main (le MJ sait qui ils sont)Au réveil, le MJ annonce au Diable quels rôles ont demandé à le voir Le Diable choisit qui il accepte et lance le dé pour chaque demande acceptée Le MJ applique les effets Un rôle puissant, imprévisible… où chaque faveur peut coûter la vie 😈🎲
        `
    },
    {
        id: "LE GOUROU",
        title: "Le Gourou",
        image: "le_gourou.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_gourou.svg" class="emoji-svg" alt="Gourou"> <strong>Le Gourou</strong>
        </span><br>
        Maître des esprits, il contrôle la volonté des autres pour les transformer en ses ensorcelés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Gagner seul lorsque tous les joueurs vivants sont sous ton emprise.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir — Maraboutage</strong>
        </span><br>
        Tu te réveilles en dernier, après tous les autres rôles.<br>
        Selon le nombre de joueurs, tu peux choisir un ou deux joueurs à marabouter pendant la nuit.<br>
        Ces joueurs deviennent alors ensorcelés : ils sont sous ton contrôle, souvent secrets, et suivent ta volonté.<br>
        Ton but est d’ensorceler progressivement tout le village vivant.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Choisis avec soin tes premières cibles pour éviter d’éveiller les soupçons.<br>
        - Gère discrètement ton influence pour ne pas que le village devienne suspicieux.<br>
        - Patiente et planifie : ta victoire dépend de ta capacité à conquérir tous les survivants.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Le Gourou est un rôle solo. Il se réveille en dernier et peut marabouter un ou deux joueurs (en fonction du nombre de participants), qui deviendront des ensorcelés. Il gagne lorsque tous les joueurs en vie sont sous son emprise.
        `
    },
    {
        id: "LE CHEVALIER DE LA MORT",
        title: "Le Chevalier de la Mort",
        image: "le_chevalier_de_la_mort.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_chevalier_de_la_mort.svg" class="emoji-svg" alt="Chevalier"> <strong>Le Chevalier de la Mort</strong>
        </span><br>
        Guerrier mystérieux venu des ombres, il n’apparaît que lors des grandes épopées, quand l’histoire du village bascule dans l’extraordinaire.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Varie selon le scénario : le Chevalier de la Mort n’a pas de but standard.<br>
        Son rôle, ses alliances et ses moyens de victoire sont définis par le maître du jeu, selon les besoins de la narration.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Ce rôle est réservé aux parties scénarisées.<br>
        Il est introduit en secret à un moment-clé, ou en réponse à un événement déclencheur prévu par le scénario.<br>
        Ses pouvoirs, sa mission, ses interactions (allié ou ennemi, agent du chaos ou ange de la vengeance) dépendent entièrement de l’histoire en cours.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Si tu es maître du jeu, utilise ce rôle comme élément de surprise ou de rebondissement fort.<br>
        - Si tu es joueur, reste à l’écoute des instructions et du contexte : ton rôle peut changer tout le déroulement de la partie !<br>
        - Ce rôle est un levier pour l’ambiance, la créativité et les retournements de situation inoubliables.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Ce rôle n’est pas fait pour les parties classiques. Il est réservé aux parties scénarisées, où la narration, les retournements de situation et les surprises sont au cœur du jeu. Il peut être introduit en secret, à un moment précis de l’histoire, ou dépendre d’un événement déclencheur prévu dans le scénario.
        `
    },
    {
        id: "LE SERIAL KILLER",
        title: "Le Serial Killer",
        image: "le_serial_killer.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_serial_killer.svg" class="emoji-svg" alt="Serial Killer"> <strong>Le Serial Killer</strong>
        </span><br>
        Il ne parle pas. Il ne pactise pas. Il tue. Solitaire absolu, il avance dans l’ombre, un couteau à la main.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Tu joues seul contre tous.<br>
        Tu gagnes si tu es le dernier joueur en vie à la fin de la partie.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Chaque nuit, tu peux décider de tuer un joueur… ou de ne rien faire, à ta convenance.<br>
        C’est toi seul qui choisis le moment idéal pour passer à l’attaque ou rester caché.<br>
        Tu n’appartiens à aucun camp (village, loups, vampires, etc.) et tu n’as pas d’alliés.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Sois patient : ne frappe que quand c’est utile ou quand tu peux semer la confusion.<br>
        - Reste discret et mélange-toi à la masse pour détourner les soupçons.<br>
        - N’oublie jamais ton objectif : éliminer tout le monde, sans exception.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Il ne parle pas. Il ne pactise pas. Il tue. Le Serial Killer joue seul, contre tous. Il ne fait pas partie du village, ni des Loups, ni des Vampires. Il n’a pas d’alliés. Juste une lame… et beaucoup de rancune. Chaque nuit, il peut décider de tuer un joueur, ou pas. C’est lui qui choisit quand frapper, et quand se fondre dans la masse. Il gagne uniquement s’il reste le dernier en vie. S’il vous dit qu’il est "un simple paysan un peu discret", fuyez !
        `
    },
    {
        id: "LE LOUP-GAROU SAUVAGE",
        title: "Le Loup-Garou Sauvage",
        image: "le_loup_garou_sauvage.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_loup_garou_sauvage.svg" class="emoji-svg" alt="Sauvage"> <strong>Le Loup-Garou Sauvage</strong>
        </span><br>
        Téméraire et indépendant, il rompt avec la meute pour jouer sa propre survie… et sa propre victoire.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Gagner seul, en éliminant tous les paysans et tous les loups-garous.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Tu ne respectes pas les règles de la meute : tu agis en solo, même si tu te réveilles et votes en même temps que les loups-garous.<br>
        Une nuit sur deux, immédiatement après le tour des loups-garous, tu peux dévorer un loup-garou de ton choix.<br>
        Ton but est d’éliminer tous, loups comme paysans, pour rester le dernier survivant.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Sois stratégique dans tes attaques : vise les loups au bon moment pour ne pas t’attirer trop de soupçons.<br>
        - Simule un comportement de membre de la meute pendant les discussions pour éviter la méfiance.<br>
        - Garde toujours en tête que tu joues pour toi seul : la méfiance des loups peut devenir une opportunité.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Le Loup-Garou Sauvage n’obéit pas aux règles de la meute, il agit en solo. C’est un des rôles les plus difficiles à jouer, car il gagne seul, ayant éliminé tout le village et les loups-garous. Une nuit sur deux, il peut dévorer un loup-garou juste après leur tour. Il se réveille et vote en même temps que les loups.
        `
    },
    {
        id: "LES JUMEAUX EXPLOSIFS",
        title: "Les Jumeaux Explosifs",
        image: "les_jumeaux_explosifs.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="les_jumeaux_explosifs.svg" class="emoji-svg" alt="Jumeaux"> <strong>Les Jumeaux Explosifs</strong>
        </span><br>
        Deux pyromanes intrépides, prêts à faire exploser le village… au propre comme au figuré.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Gagner ensemble en semant le chaos jusqu’à être les derniers survivants.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir</strong>
        </span><br>
        Chaque nuit, vous vous réveillez secrètement pour poser une bombe dans le dos d’un joueur.<br>
        Au lever du jour, le MJ annonce : « Ce joueur se balade avec un léger tic-tac dans le dos... »<br>
        Le village doit alors voter pour sauver la personne piégée en votant contre elle afin de désamorcer la bombe.<br>
        Le joueur piégé ne meurt pas lors du vote, mais si le village ne vote pas contre lui, la bombe explose, ce qui cause la mort de deux joueurs ce jour-là (la victime du vote + celle des jumeaux).<br>
        Chaque nuit, tant qu’au moins un Jumeau est en vie, vous pouvez poser une nouvelle bombe.<br>
        Le seul moyen d’arrêter le massacre est de découvrir et éliminer les deux Jumeaux.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Misez sur la confusion : votre mécanique pousse le village à un dilemme mortel.<br>
        - Travaillez en équipe pour poser des bombes stratégiques.<br>
        - Cachez votre identité pour continuer à semer la terreur.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Deux joueurs, un seul but : faire péter la partie… au sens propre. Chaque nuit, les Jumeaux se réveillent en secret pour attacher une bombe dans le dos d’un joueur. Au lever du jour, le MJ annonce : « Ce joueur se balade avec un léger tic-tac dans le dos... » Le village doit alors sauver cette personne en votant contre elle pour désamorcer la bombe, ce qui n’élimine pas le joueur. S’il ne le fait pas, la bombe explose, entraînant la mort de deux joueurs ce jour-là. Chaque nuit, une nouvelle bombe peut être posée tant qu’au moins un Jumeau est en vie. Le massacre ne s’arrête qu’une fois les deux Jumeaux découverts et éliminés.
        `
    },
    {
        id: "DRACULA",
        title: "Dracula",
        image: "dracula.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="dracula.svg" class="emoji-svg" alt="Dracula"> <strong>Dracula</strong>
        </span><br>
        Le roi des suceurs de sang ne porte pas ce nom pour rien…<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre et dominer la partie.<br>
        Tu gagnes si toi-même ou au moins un de tes vampires est encore en vie à la fin.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir — Conversion nocturne</strong>
        </span><br>
        Chaque nuit, tu choisis un joueur à mordre pour le convertir en vampire.<br>
        Ce joueur rejoint secrètement ta lignée et devient un membre de ta meute vampirique.<br>
        Les vampires agissent ensemble lors des phases nocturnes, mais leur allégeance reste cachée aux autres joueurs.<br>
        ⚠️ Faiblesse : Si Dracula meurt, tous ses vampires meurent immédiatement avec lui.<br>
        La chute de Dracula entraîne la fin tragique de sa lignée : un incendie surnaturel consume tous ses sujets en un éclair.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Choisis tes conversions avec soin, en visant des alliés sûrs ou des rôles stratégiques.<br>
        - Protège-toi à tout prix : ta survie est la clé de celle de ta meute.<br>
        - Coordonne discrètement tes vampires pour contrôler le jeu sans te faire repérer.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Le roi des suceurs de sang ne porte pas ce nom pour rien… Chaque nuit, Dracula peut sélectionner un cou bien charnu à son goût. Le joueur ainsi mordu rejoint secrètement les rangs des vampires, devenant l’un de ses fidèles créatures de la nuit. Fini les bains de soleil, place aux bains de sang. Mais attention, l’éternité a un prix… Si Dracula meurt, tous ses sujets le suivent dans la tombe. Littéralement. En une seconde, toute sa lignée prend feu comme une brochette à la pleine lune. Les vampires ne survivent jamais à la chute de leur roi.
        `
    },
    {
        id: "LA SUCCUBE",
        title: "La Succube",
        image: "la_succube.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="la_succube.svg" class="emoji-svg" alt="Succube"> <strong>La Succube</strong>
        </span><br>
        Séductrice et changeante, elle emprunte chaque nuit un visage et un pouvoir différent… toujours au service de la nuit.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Aider les vampires à prendre le contrôle du jeu.<br>
        Tu gagnes si Dracula (ou un vampire) survit et qu'il reste des vampires à la fin.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir — Copieuse nocturne</strong>
        </span><br>
        Première nuit : tu copies le pouvoir du Voyant — tu peux connaître le rôle d’un joueur.<br>
        Deuxième nuit : tu copies le pouvoir de la Sorcière — tu disposes des potions, et peux sauver ou éliminer un joueur de ton choix.<br>
        Troisième nuit : tu copies le pouvoir du Bûcheron — si tu es éliminée ou le souhaites, tu peux entraîner un autre joueur dans la mort avec toi.<br>
        Après la troisième nuit : tu perds tous tes pouvoirs spéciaux, mais tu restes en jeu comme vampire classique.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Utilise chaque pouvoir au moment le plus stratégique pour influencer la dynamique de la partie.<br>
        - Fais attention à rester discret(e) : trop d’actions spectaculaires peuvent te trahir.<br>
        - Après tes trois nuits magiques, mise sur la coopération avec tes alliés vampires et protège Dracula.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        La Succube ne se contente pas de charmer, elle copie. Chaque nuit, elle s’approprie le pouvoir d’un rôle emblématique, un vrai défilé de déguisements maléfiques. Première nuit : elle voit à travers les esprits comme le Voyant. Deuxième nuit : elle manie les potions comme la Sorcière. Troisième nuit : elle vise, tire, et emporte un joueur avec elle, comme le Bûcheron. Après ces trois nuits, ses pouvoirs s’évanouissent, mais son aura, elle, reste intacte… et redoutable.
        `
    },
    {
        id: "LE CHASSEUR DE VAMPIRES",
        title: "Le Chasseur de Vampires",
        image: "le_chasseur_de_vampires.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_chasseur_de_vampires.svg" class="emoji-svg" alt="Chasseur"> <strong>Le Chasseur de Vampires</strong>
        </span><br>
        Silencieux. Déterminé. Son flair et ses rituels sont la seule vraie défense contre les créatures de la nuit.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Aider le village à se débarrasser des vampires.<br>
        Tu gagnes si les vampires sont tous éliminés et qu’au moins un paysan survit.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoirs</strong>
        </span><br>
        Chaque nuit, tu cibles un joueur : le Maître du Jeu te révèle en secret si cette personne est vampire ou non.<br>
        Une fois dans la partie, tu peux utiliser ton rituel de guérison : tu choisis un joueur transformé en vampire et tu lui rends son humanité, le retransformant en paysan ordinaire.<br>
        ⚠️ Ce pouvoir ne fonctionne qu’une fois et uniquement si la cible est effectivement un vampire. S’il est utilisé sur un innocent, il est perdu.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Utilise tes enquêtes pour dévoiler la meute vampirique au grand jour, mais évite de te révéler trop tôt.<br>
        - Choisis avec soin le moment pour utiliser ton rituel de guérison : sauve un rôle utile pour le village.<br>
        - Collabore discrètement avec les paysans pour remonter la piste jusqu’à Dracula !<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Silencieux. Déterminé. Et équipé d’ail dans toutes ses poches, le Chasseur de Vampires cible chaque nuit un joueur. Le Maître du Jeu lui révèle si cette personne est un vampire ou non. Il traque dans l’ombre, mais avec méthode. Une seule fois dans la partie, il peut effectuer un rituel de guérison sur un joueur vampirisé : la cible redevient un paysan. ⚠️ Si le pouvoir de verification est utilisé sur un innocent, il est perdu. C’est le seul vrai vaccin contre la morsure… et parfois, il suffit aussi d’un pieu bien placé.
        `
    },
    {
        id: "LE DÉMON VAMPIRE",
        title: "Le Démon Vampire",
        image: "le_demon_vampire.webp",
        description: `
        <span style="font-size:1.2em;">
            <img src="le_demon_vampire.svg" class="emoji-svg" alt="Démon"> <strong>Le Démon Vampire</strong>
        </span><br>
        Mi-démon, mi-vampire… et totalement indestructible la nuit. Sa seule peur : le feu du jour et la colère du village.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Objectif.svg" class="emoji-svg" alt="Objectif"> <strong>Objectif</strong>
        </span><br>
        Survivre jusqu’à la victoire du camp vampire, ou jusqu’à être le dernier en vie — selon le scénario spécial choisi par le Maître du Jeu.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Pouvoir.svg" class="emoji-svg" alt="Pouvoir"> <strong>Pouvoir — Invulnérabilité nocturne</strong>
        </span><br>
        Personne ne peut t’atteindre ou te tuer pendant la nuit :<br>
        Loups-garous, sorcières, bête immonde, bombes, autres vampires… aucune action nocturne n’a d’effet sur toi.<br>
        La seule manière de t’éliminer : être désigné au bûcher lors du vote en journée, puis éliminé aux yeux de tous.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Conseils.svg" class="emoji-svg" alt="Conseils"> <strong>Conseils</strong>
        </span><br>
        - Reste discret pour éviter de devenir une cible évidente lors des votes.<br>
        - Utilise ta protection nocturne pour prendre des risques ou influencer le cours de la partie.<br>
        - Si tu sens que la suspicion monte, prépare une défense solide pour les débats du jour : seul le bûcher peut te détruire.<br><br>
        
        <span style="font-size:1.2em;">
            <img src="Description.svg" class="emoji-svg" alt="Description"> <strong>Description</strong>
        </span><br>
        Mi-démon, mi-vampire… 100% problème. Le Démon Vampire n’est pas une créature ordinaire. Il rôde dans l’ombre, invulnérable à tout ce qui pourrait l’atteindre la nuit. Loups, sorcières, bêtes ou bombes : rien ne peut l’égratigner quand le soleil dort. La seule façon de le faire disparaître ? Le convoquer au bûcher, en plein jour, sous les yeux brûlants du village… et espérer qu’il ne rit pas avant de flamber.
        `
    },
];

document.addEventListener('DOMContentLoaded', function() {
    
    // ===============================
    // 1. INITIALISATION & VARIABLES
    // ===============================
    
    // CORRECTIF ESPACES : Remplace les doubles sauts par un espace plus aéré (14px)
    document.querySelectorAll('.carte-back p').forEach(p => {
        p.innerHTML = p.innerHTML.replace(/\n\s*\n/g, '<span style="display:block; height:14px;"></span>');
    });
    
    let overlay = document.querySelector('.details-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'details-overlay';
        document.body.appendChild(overlay);
    }
    
    const detailsPanel = document.querySelector('.details-panel');
    if (detailsPanel && !detailsPanel.querySelector('.details-content')) {
        detailsPanel.innerHTML = '<div class="details-content"></div>';
    }
    
    const cardsArray = Array.from(document.querySelectorAll('.carte-jeu'));

    // ===============================
    // 13. SYSTÈME DE DÉVERROUILLAGE & VALIDATION (CORRIGÉ V5)
    // ===============================
    
    // A. Navigation dans le cadenas (Slides Intro)
    window.nextLockSlide = function(index) {
        document.querySelectorAll('.lock-slide').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.dot').forEach(el => el.classList.remove('active'));
        
        const nextSlide = document.getElementById(`lock-slide-${index}`);
        const nextDot = document.getElementById(`dot-${index}`);
        
        if(nextSlide) nextSlide.classList.add('active');
        if(nextDot) nextDot.classList.add('active');
    };

    // B. Fermer l'intro
    window.finishIntro = function() {
        closeModal('modal-lock-intro');
        setTimeout(() => {
            const extraMenu = document.querySelector('.extra-menu');
            if(extraMenu && !extraMenu.classList.contains('open')) {
                toggleExtraMenu();
            }
        }, 500);
    };

    // C. Validation Règles
    window.finishRules = function() {
        localStorage.setItem('vm_rules_read', 'true');
        updateValidationButtons();
        closeModal('modal-regles-base');
        
        // Mise à jour visuelle du menu
        const menuLink = document.getElementById('link-regles-base');
        if(menuLink) {
            menuLink.classList.add('menu-completed');
            menuLink.innerHTML = '<img src="Regle_de_base.svg" alt="Règles" class="menu-icon"> Règles de base ✅';
        }
        
        checkGameUnlock();
    };

    // D. Signature Pacte
    window.signPact = function() {
        localStorage.setItem('vm_pact_read', 'true');
        updateValidationButtons();
        closeModal('modal-regles');

        // Mise à jour visuelle du menu
        const menuLink = document.getElementById('link-pact');
        if(menuLink) {
            menuLink.classList.add('menu-completed');
            menuLink.innerHTML = '<img src="Le_pacte_maudit.svg" alt="Pacte" class="menu-icon"> Le Pacte Maudit ✅';
        }
        
        checkGameUnlock();
    };

    // E. Vérification État du jeu
    function checkGameUnlock() {
        const rulesRead = localStorage.getItem('vm_rules_read') === 'true';
        const pactRead = localStorage.getItem('vm_pact_read') === 'true';

        if (rulesRead && pactRead) {
            document.body.classList.remove('locked-game');
            // Notification succès final
            if(!sessionStorage.getItem('unlocked_notif_shown')) {
                showNotification("🔓 Village Ouvert", "Bienvenue. Fais attention à toi.");
                sessionStorage.setItem('unlocked_notif_shown', 'true');
            }
        } else {
            document.body.classList.add('locked-game');
        }
    }

    // F. Mise à jour Boutons & Menus (au chargement)
    function updateValidationButtons() {
        const rulesRead = localStorage.getItem('vm_rules_read') === 'true';
        const pactRead = localStorage.getItem('vm_pact_read') === 'true';

        // Bouton Règles
        const btnRules = document.querySelector('#modal-regles-base .btn-validate');
        if (btnRules && rulesRead) {
            btnRules.classList.add('disabled');
            btnRules.innerHTML = "✅ Règles Lues";
            btnRules.removeAttribute('onclick');
        }
        // Menu Règles
        const linkRules = document.getElementById('link-regles-base');
        if(linkRules && rulesRead) {
            linkRules.classList.add('menu-completed');
            linkRules.innerHTML = '<img src="Regle_de_base.svg" alt="Règles" class="menu-icon"> Règles de base ✅';
        }

        // Bouton Pacte
        const btnPact = document.querySelector('#modal-regles .btn-validate');
        if (btnPact && pactRead) {
            btnPact.classList.add('disabled');
            btnPact.innerHTML = "✅ Pacte Signé";
            btnPact.removeAttribute('onclick');
        }
        // Menu Pacte
        const linkPact = document.getElementById('link-pact');
        if(linkPact && pactRead) {
            linkPact.classList.add('menu-completed');
            linkPact.innerHTML = '<img src="Le_pacte_maudit.svg" alt="Pacte" class="menu-icon"> Le Pacte Maudit ✅';
        }
    }

    // G. Lancement Initial
    function initGameLock() {
        updateValidationButtons();
        const rulesRead = localStorage.getItem('vm_rules_read') === 'true';
        const pactRead = localStorage.getItem('vm_pact_read') === 'true';

        if (!rulesRead || !pactRead) {
            document.body.classList.add('locked-game');
            setTimeout(() => {
                const modal = document.getElementById('modal-lock-intro');
                if(modal) {
                    modal.classList.add('active');
                    document.body.style.position = 'fixed';
                    document.body.style.width = '100%';
                }
            }, 500);
        } else {
            document.body.classList.remove('locked-game');
        }
    }
    
    // H. DÉTECTION SCROLL PACTE (Version Corrigée)
window.initPactScrollListener = function() {
    // On cible le conteneur avec la classe CSS spécifique
    const scrollContainer = document.querySelector('#modal-regles .rules-container-styled');
    const btnPact = document.getElementById('btn-sign-pact');
    
    if(!scrollContainer || !btnPact) return;

    // CORRECTION ICI : On vérifie si c'est DÉJÀ SIGNÉ via le stockage, pas via la classe CSS
    if(localStorage.getItem('vm_pact_read') === 'true') return;

    // Fonction de vérification
    const checkScroll = () => {
        // Tolérance (50px) pour éviter les bugs sur mobile
        const isAtBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 50;
        
        if (isAtBottom) {
            btnPact.classList.remove('disabled');
            btnPact.style.animation = "superPulse 1s infinite ease-in-out";
        }
    };

    // 1. On vérifie tout de suite (si le texte est court)
    if (scrollContainer.scrollHeight <= scrollContainer.clientHeight + 50) {
        btnPact.classList.remove('disabled');
        btnPact.style.animation = "superPulse 1s infinite ease-in-out";
    }

    // 2. On écoute le scroll
    scrollContainer.addEventListener('scroll', checkScroll);

    // 3. Sécurité : on revérifie après 1 seconde
    setTimeout(checkScroll, 1000);
};

    // I. FONCTION RESET (POUR LE DÉVELOPPEUR)
    window.resetProgression = function() {
        if(confirm("Réinitialiser ta progression pour tester comme un nouveau joueur ?")) {
            localStorage.removeItem('vm_rules_read');
            localStorage.removeItem('vm_pact_read');
            localStorage.removeItem('theme');
            location.reload();
        }
    };

    // Lancement
    initGameLock();

    // ===============================
    // 2. GESTION MENU BURGER
    // ===============================
    const burgerBtn = document.querySelector('.burger-btn');
    const extraMenu = document.querySelector('.extra-menu');
    const extraOverlay = document.querySelector('.extra-menu-overlay');
    const closeExtraBtn = document.querySelector('.close-extra');

    function toggleExtraMenu() {
        if(extraMenu) extraMenu.classList.toggle('open');
        if(extraOverlay) extraOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    if(burgerBtn) burgerBtn.addEventListener('click', toggleExtraMenu);
    if(closeExtraBtn) closeExtraBtn.addEventListener('click', toggleExtraMenu);
    if(extraOverlay) extraOverlay.addEventListener('click', toggleExtraMenu);

   // ===============================
    // 3. GESTION DES MODALES (AVEC TRIGGER PACTE)
    // ===============================
    
    let scrollPosition = 0;

    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) {
            scrollPosition = window.scrollY;
            modal.classList.add('active');
            
            // Verrouillage scroll
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPosition}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';

            if(extraMenu && extraMenu.classList.contains('open')) toggleExtraMenu();

            // TRIGGER SPECIAL : Si c'est le Pacte, on lance l'écouteur de scroll
            if(modalId === 'modal-regles') {
                setTimeout(window.initPactScrollListener, 200);
            }
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) {
            modal.classList.remove('active');
            
            // Déverrouillage scroll
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, scrollPosition);
        }
    };

    // Empêcher la fermeture de l'intro en cliquant dehors
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (modal.id === 'modal-lock-intro') return;
            if (e.target === modal) window.closeModal(modal.id);
        });
    });

    // ===============================
    // GESTION DES NOTIFICATIONS
    // ===============================
    
    window.showNotification = function(title, message) {
        const notif = document.getElementById('custom-notification');
        const notifTitle = document.getElementById('notif-title');
        const notifMsg = document.getElementById('notif-message');
        
        if(notif && notifTitle && notifMsg) {
            notifTitle.innerHTML = title; 
            notifMsg.innerHTML = message.replace(/\n/g, '<br>');
            notif.classList.add('active');
        } else {
            alert(message.replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, ""));
        }
    };

    window.closeNotification = function() {
        const notif = document.getElementById('custom-notification');
        if(notif) notif.classList.remove('active');
    };

    const notifOverlay = document.getElementById('custom-notification');
    if(notifOverlay) {
        notifOverlay.addEventListener('click', (e) => {
            if(e.target === notifOverlay) window.closeNotification();
        });
    }

    // ===============================
    // GESTION ENVOI FORMULAIRES
    // ===============================
    window.submitRole = function(e) {
        e.preventDefault();
        /* ... Code envoi rôle inchangé ... */
        const form = e.target;
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Envoi en cours...";
        submitBtn.disabled = true;
        const formData = new FormData(form);
        fetch("https://formsubmit.co/contact@lacourduroi.fr", { method: "POST", body: formData })
        .then(r => r.ok ? true : new Error("Erreur"))
        .then(() => {
            showNotification("📜 Reçu !", "Proposition envoyée.");
            closeModal('modal-propose');
            form.reset();
        })
        .catch(() => showNotification("⚠️ Oups", "Erreur technique."))
        .finally(() => { submitBtn.textContent = originalText; submitBtn.disabled = false; });
    };

    window.submitBug = function(e) {
        e.preventDefault();
        /* ... Code envoi bug inchangé ... */
        const form = e.target;
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Envoi...";
        submitBtn.disabled = true;
        const formData = new FormData(form);
        fetch("https://formsubmit.co/contact@lacourduroi.fr", { method: "POST", body: formData })
        .then(r => r.ok ? true : new Error("Erreur"))
        .then(() => {
            showNotification("🐛 Envoyé !", "Merci pour le signalement.");
            closeModal('modal-bug');
            form.reset();
        })
        .catch(() => showNotification("⚠️ Oups", "Erreur technique."))
        .finally(() => { submitBtn.textContent = originalText; submitBtn.disabled = false; });
    };

    // ===============================
    // 4. GESTION DU THÈME
    // ===============================
    const themeBtn = document.getElementById('themeBtn');
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        if(themeBtn) themeBtn.textContent = '☀️';
    }
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            themeBtn.textContent = isLight ? '☀️' : '🌙';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    // ===============================
    // 5. FLIP CARTES
    // ===============================
    document.querySelectorAll('.carte-jeu').forEach(carte => {
        carte.addEventListener('click', function(e) {
            if (document.body.classList.contains('locked-game')) return; // Sécurité
            if (e.target.closest('.btn-details')) return;
            e.stopPropagation();
            if (navigator.vibrate) navigator.vibrate(50);
            const isAlreadyFlipped = this.classList.contains('flipped');
            document.querySelectorAll('.carte-jeu.flipped').forEach(c => {
                if (c !== this) c.classList.remove('flipped');
            });
            this.classList.toggle('flipped');
        });
    });

    // ===============================
    // 6. ANIMATION AU SCROLL
    // ===============================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '50px' });
    document.querySelectorAll('.carte-jeu, .carte-vm').forEach(el => observer.observe(el));

    // ===============================
    // 7. RECHERCHE RAPIDE
    // ===============================
    const quickSearchInput = document.getElementById('quickSearch');
    if (quickSearchInput) {
        quickSearchInput.addEventListener('input', function() {
            const term = this.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
            const searchTerms = term.split(" ");
            cardsArray.forEach(card => {
                const h3 = card.querySelector('h3');
                const title = h3 ? h3.textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
                const matches = searchTerms.every(word => title.includes(word));
                if (matches) {
                    card.style.display = ''; 
                    setTimeout(() => card.classList.add('visible'), 10);
                } else {
                    card.style.display = 'none';
                    card.classList.remove('visible');
                }
            });
            document.querySelectorAll('section:not(#event-cards)').forEach(sec => {
                const hasVisibleCards = Array.from(sec.querySelectorAll('.carte-jeu')).some(c => c.style.display !== 'none');
                const h2 = sec.querySelector('h2');
                if(h2) h2.style.display = (hasVisibleCards || term === '') ? '' : 'none';
            });
        });
    }

// ===============================
    // 8. ZOOM CARTES VM (CORRECTIF INSTANTANÉ)
    // ===============================
    const vmOverlay = document.getElementById('vm-overlay');
    
    function closeZoom() {
        document.querySelectorAll('.carte-vm.zoomed').forEach(c => c.classList.remove('zoomed'));
        if (vmOverlay) vmOverlay.classList.remove('active');
        
        // 1. On coupe l'animation fluide pour que ce soit INSTANTANÉ
        document.documentElement.style.scrollBehavior = 'auto';
        
        // 2. On débloque la page
        document.body.classList.remove('no-scroll');
        document.body.style.top = ''; 
        
        // 3. On téléporte la page à l'ancienne position
        window.scrollTo(0, scrollPosition);
        
        // 4. On remet l'animation fluide après un tout petit délai
        setTimeout(() => {
            document.documentElement.style.scrollBehavior = '';
        }, 10);
    }

    function openZoom(card) {
        if (document.body.classList.contains('locked-game')) return; 
        
        // On note la position actuelle
        scrollPosition = window.scrollY;
        
        document.querySelectorAll('.carte-vm.zoomed').forEach(c => c.classList.remove('zoomed'));
        card.classList.add('zoomed');
        if (vmOverlay) vmOverlay.classList.add('active');
        
        // On fige la page à cette position exacte
        document.body.style.top = `-${scrollPosition}px`;
        document.body.classList.add('no-scroll');
    }

    document.querySelectorAll('.carte-vm').forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            if (card.classList.contains('zoomed')) closeZoom(); else openZoom(card);
        });
    });
    if (vmOverlay) vmOverlay.addEventListener('click', closeZoom);
    
    // ===============================
    // 9. DÉTAILS PANEL (CORRECTIF INSTANTANÉ)
    // ===============================
    window.closeDetails = function() {
        if (detailsPanel) {
            detailsPanel.classList.remove('active');
            setTimeout(() => { detailsPanel.style.transform = ''; }, 300);
        }
        if(overlay) overlay.classList.remove('active');
        
        // 1. Coupe l'animation fluide -> Retour INSTANTANÉ
        document.documentElement.style.scrollBehavior = 'auto';
        
        document.body.classList.remove('no-scroll');
        document.body.style.top = '';
        window.scrollTo(0, scrollPosition);
        
        // 2. Remet l'animation fluide
        setTimeout(() => {
            document.documentElement.style.scrollBehavior = '';
        }, 10);
        
        const v = detailsPanel ? detailsPanel.querySelector('video') : null;
        if(v) v.pause();
    };

    overlay.addEventListener('click', function() {
        if(detailsPanel.classList.contains('active')) closeDetails();
    });

    function openDetails(cardData) {
        if (navigator.vibrate) navigator.vibrate(15);
        const content = detailsPanel.querySelector('.details-content') || detailsPanel;
        
        const videoSrc = cardData.image.replace(/\.(png|jpg|jpeg|webp)$/i, '.mp4');
        
        content.innerHTML = `
          <div class="details-header">
            <h2 class="details-title">${cardData.title}</h2>
            <button class="close-details" onclick="closeDetails()">✕</button>
          </div>
          <div class="media-wrapper" style="position:relative; min-height:200px; display:flex; justify-content:center;">
              <video class="details-video" src="${videoSrc}" poster="${cardData.image}" autoplay loop muted playsinline webkit-playsinline style="width:100%; height:auto; display:block;">
              </video>
          </div>
          <div class="details-section">${cardData.description || ''}</div>
        `;

        const videoEl = content.querySelector('.details-video');
        const wrapper = content.querySelector('.media-wrapper');
        
        if(videoEl) {
            videoEl.addEventListener('error', () => {
                wrapper.innerHTML = `<img src="${cardData.image}" alt="${cardData.title}" class="details-image" style="width:100%; height:auto; display:block;">`;
            });
        }

        // --- BLOCAGE POSITION ---
        scrollPosition = window.scrollY;
        
        detailsPanel.classList.add('active');
        overlay.classList.add('active');
        
        document.body.style.top = `-${scrollPosition}px`;
        document.body.classList.add('no-scroll');
        
        detailsPanel.scrollTop = 0;
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-details')) {
            e.stopPropagation();
            e.preventDefault();
            const carte = e.target.closest('.carte-jeu');
            const h3 = carte.querySelector('.carte-back h3');
            const img = carte.querySelector('.carte-front img');
            const p = carte.querySelector('.carte-back p');
            if (!h3 || !img) return; 
            const title = h3.textContent.trim();
            const image = img.src;
            const panini = (typeof paniniRoles !== 'undefined') ? paniniRoles.find(r => r.title.includes(title) || r.id === title.toUpperCase()) : null;
            let cardData;
            if (panini) {
                cardData = { ...panini, image: panini.image || image };
            } else {
                const desc = p ? p.innerHTML : "Pas de description.";
                cardData = { title: title, image: image, description: desc };
            }
            openDetails(cardData);
        }
    });

    // --- LOGIQUE SWIPE FLUIDE ---
    let touchStartX = 0;
    let currentTranslateX = 0;
    let isDragging = false;
    if (detailsPanel) {
        detailsPanel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            isDragging = true;
            detailsPanel.style.transition = 'none';
        }, {passive: true});
        detailsPanel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const touchCurrentX = e.touches[0].clientX;
            const deltaX = touchCurrentX - touchStartX;
            if (deltaX > 0) {
                currentTranslateX = deltaX;
                detailsPanel.style.transform = `translateX(${deltaX}px)`;
            }
        }, {passive: true});
        detailsPanel.addEventListener('touchend', (e) => {
            isDragging = false;
            detailsPanel.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), right 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
            if (currentTranslateX > 100) {
                closeDetails();
                setTimeout(() => { detailsPanel.style.transform = ''; currentTranslateX = 0; }, 300);
            } else {
                detailsPanel.style.transform = 'translateX(0)';
                currentTranslateX = 0;
            }
        }, {passive: true});
    }

    // ===============================
    // 10. PIED DE PAGE
    // ===============================
    const pageFooter = document.createElement('footer');
    pageFooter.innerHTML = `
      <div style="text-align: center; padding: 40px 20px 60px; color: var(--gold); opacity: 0.7; font-family: 'Almendra', serif;">
        <strong>© 2026 Le Village Maudit</strong><br>
        <em style="font-size: 0.9em;">by Nabil & Joelson</em>
      </div>
    `;
    document.body.appendChild(pageFooter);

    // ===============================
    // 11. PWA SERVICE WORKER
    // ===============================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('Service Worker enregistré'))
                .catch(err => console.log('Erreur SW', err));
        });
    }

    // ===============================
    // 12. GESTION DES SLIDES (AVEC UNLOCK BOUTON)
    // ===============================
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const slideCounter = document.getElementById('slide-counter');

    window.changeSlide = function(direction) {
        // Masquer l'actuelle
        if(slides[currentSlideIndex]) slides[currentSlideIndex].classList.remove('active');
        
        // Calcul
        currentSlideIndex += direction;
        
        // Bornes (On ne boucle pas, on bloque aux extrémités)
        if (currentSlideIndex < 0) currentSlideIndex = 0;
        if (currentSlideIndex >= slides.length) currentSlideIndex = slides.length - 1;
        
        // Afficher la nouvelle
        if(slides[currentSlideIndex]) slides[currentSlideIndex].classList.add('active');
        
        // Compteur
        if(slideCounter) slideCounter.textContent = `${currentSlideIndex + 1} / ${slides.length}`;
        
        // Scroll top
        const container = document.querySelector('.slides-container');
        if(container) container.scrollTop = 0;

        // --- LOGIQUE UNLOCK ---
        // Si on est sur la dernière slide (index 8)
        const btnRules = document.getElementById('btn-validate-rules');
        if (btnRules && !btnRules.textContent.includes('Lues')) { // Si pas déjà validé
            if (currentSlideIndex === slides.length - 1) {
                btnRules.classList.remove('disabled');
                btnRules.style.animation = "superPulse 1s infinite ease-in-out";
            }
        }
    };
    
    // ===============================
    // 14. EMOJIS DOS DE CARTE (CLIENT)
    // ===============================
    window.updateCardBackEmojis = function(attributes) {
        const container = document.getElementById('card-emoji-container');
        if (!container) return; // Si la carte n'est pas affichée, on ne fait rien

        container.innerHTML = ""; // Reset

        if (!attributes) return;

        // Logique d'affichage : on vérifie s'il y a des clés qui commencent par...
        const hasInfected = Object.keys(attributes).some(k => k.startsWith('infected'));
        
        if (hasInfected) {
            container.innerHTML += `<div style="font-size:2em; filter:drop-shadow(0 0 3px black);">🐾</div>`;
        }
        
        // (Tu pourras ajouter d'autres émojis ici plus tard si besoin : amoureux, cible, etc.)

    }; // La fonction se ferme bien ici à la fin

    // ===============================
    // GESTION DU LOADING SPINNER
    // ===============================
    window.showLoader = function() {
        const l = document.getElementById('global-loader');
        if(l) l.style.display = 'flex';
    };
    window.hideLoader = function() {
        const l = document.getElementById('global-loader');
        if(l) l.style.display = 'none';
    };

    // Modification de la fonction openDetails pour inclure le loader
    const originalOpenDetails = window.openDetails || openDetails;
    window.openDetails = function(cardData) {
        window.showLoader(); 
        
        const img = new Image();
        img.src = cardData.image;
        
        img.onload = () => {
            window.hideLoader(); 
            const content = document.querySelector('.details-panel .details-content');
            if(content) {
               const videoSrc = cardData.image.replace(/\.(png|jpg|jpeg|webp)$/i, '.mp4');
               content.innerHTML = `
                 <div class="details-header">
                   <h2 class="details-title">${cardData.title}</h2>
                   <button class="close-details" onclick="closeDetails()">✕</button>
                 </div>
                 <div class="media-wrapper" style="position:relative; min-height:200px; display:flex; justify-content:center;">
                     <video class="details-video" src="${videoSrc}" poster="${cardData.image}" autoplay loop muted playsinline webkit-playsinline style="width:100%; height:auto; display:block;"></video>
                 </div>
                 <div class="details-section">${cardData.description || ''}</div>
               `;
               
               const v = content.querySelector('video');
               if(v) { v.onerror = () => { v.parentNode.innerHTML = `<img src="${cardData.image}" class="details-image" style="width:100%;">`; }; }
               
               // --- CORRECTIF SCROLL (C'est ici que ça se joue) ---
               scrollPosition = window.scrollY;
               
               document.querySelector('.details-panel').classList.add('active');
               document.querySelector('.details-overlay').classList.add('active');
               
               document.body.style.top = `-${scrollPosition}px`;
               document.body.classList.add('no-scroll');
            }
        };
        img.onerror = () => { window.hideLoader(); }; 
    };

    // ===============================
    // UPDATE PWA NOTIFICATION
    // ===============================
    let newWorker;
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(reg => {
            reg.addEventListener('updatefound', () => {
                newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // Mise à jour disponible !
                        const toast = document.getElementById('update-notification');
                        if(toast) toast.classList.add('show');
                    }
                });
            });
        });
    }
    
    const reloadBtn = document.getElementById('reload-btn');
    if(reloadBtn) {
        reloadBtn.addEventListener('click', () => {
            if(newWorker) newWorker.postMessage({ action: 'skipWaiting' });
        });
    }
    
    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });

   // =========================================================
// GESTION DES MISES À JOUR (FINAL - HYBRIDE)
// =========================================================

    // 1. CONFIGURATION DE LA VERSION
    const CURRENT_APP_VERSION = "1.8"; // ⚠️ Change ce chiffre ici ET dans sw.js
    
    // Affiche la version dans le menu
    const versionSpan = document.getElementById('version-display');
    if(versionSpan) versionSpan.innerText = `v${CURRENT_APP_VERSION}`;

    // Affiche la version dans le Footer
    const existingFooter = document.querySelector('footer');
    if (existingFooter) {
        existingFooter.innerHTML = `
          <div style="text-align: center; padding: 40px 20px 60px; color: var(--gold); opacity: 0.7; font-family: 'Almendra', serif;">
            <strong>© 2026 Le Village Maudit</strong><br>
            <em style="font-size: 0.9em;">by Nabil & Joelson</em><br>
            <span style="font-family:sans-serif; font-size:0.8em; opacity:0.5;">Version ${CURRENT_APP_VERSION}</span>
          </div>
        `;
    }

    // 2. MESSAGE DE SUCCÈS AU DÉMARRAGE
    if (localStorage.getItem('vm_just_updated') === 'true') {
        setTimeout(() => {
            showNotification(
                "✨ Mise à jour effectuée", 
                `Bienvenue dans la version <strong>${CURRENT_APP_VERSION}</strong>`
            );
            localStorage.removeItem('vm_just_updated');
        }, 1500);
    }

    // 3. FONCTION DU BOUTON (MODE "FORCE BRUTE")
    window.checkForUpdates = function() {
        const closeExtra = document.querySelector('.close-extra');
        if(closeExtra) closeExtra.click();

        if (!('serviceWorker' in navigator)) {
            window.location.reload(); 
            return;
        }

        showNotification("⚡ Analyse...", "Vérification et nettoyage...");
        const notifBtn = document.querySelector('#custom-notification button');
        if(notifBtn) notifBtn.style.display = 'none';

        navigator.serviceWorker.ready.then(registration => {
            return registration.update().then(() => {
                return registration;
            });
        }).then((registration) => {
            const newWorker = registration.installing || registration.waiting;
            
            if (newWorker) {
                // CAS A : Vraie mise à jour trouvée (La Section 4 s'en occupera)
                showNotification("📥 Mise à jour trouvée", "Installation en cours...");
            } else {
                // CAS B : Rien trouvé -> On force le nettoyage et le reload
                showNotification("🔄 Synchronisation", "Nettoyage du cache et rechargement...");
                
                caches.keys().then(function(names) {
                    for (let name of names) caches.delete(name);
                });

                setTimeout(() => {
                    window.location.reload(true);
                }, 1000);
            }
        }).catch(err => {
            console.error("Erreur MAJ:", err);
            window.location.reload();
        });
    };

    // 4. DÉTECTION AUTOMATIQUE (INDISPENSABLE)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // C'est ici que l'installation réelle se valide
                        showNotification("🚀 Mise à jour prête", "Application de la nouvelle version...");
                        localStorage.setItem('vm_just_updated', 'true');
                        
                        if(registration.waiting) registration.waiting.postMessage({ action: 'skipWaiting' });
                        else if (newWorker) newWorker.postMessage({ action: 'skipWaiting' });
                    }
                });
            });
        });
        
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                window.location.reload();
            }
        });
    }

}); // FIN DOMContentLoaded