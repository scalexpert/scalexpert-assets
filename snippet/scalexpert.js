/**
 * Copyright © Scalexpert.
 * This file is part of Scalexpert
 *
 * @author    Société Générale
 * @copyright Scalexpert
 * @license   https://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 */

class Scalexpert {

    constructor() {
        this.devMode = {
            active: false,
            label: '== Scalexpert == ',
            isEmpty: ' is empty or not exist ?'
        };

        this.modals = [];

        window.addEventListener("keyup", (evt) => {
            if (evt.code === 'Escape') {
                if (this.devMode && this.devMode.active) {
                    console.log(this.devMode.label + 'event keypress: ' + evt.key);
                }
                this.closeModals();
            }
        });
    }

    setSettings(settings = {}) {
        this.settings = settings;

        this.listSolutionsTemplate = document.querySelector('#scalexpert');
        this.listSolutionsSolutionTemplate = document.querySelector('#scalexpert-solution');
        this.listSolutionsSolutionListTemplate = document.querySelector('#scalexpert-list');
        this.listSolutionsSolutionListItemTemplate = document.querySelector('#scalexpert-list-item');

        this.listSolutionsModalTemplate = document.querySelector('#scalexpert-modal');
        this.listSolutionsModalSolutionTemplate = document.querySelector('#scalexpert-modal-solution');

        this.listSolutionsInstallmentsItemTemplate = document.querySelector('#scalexpert-installments-item');
        this.listSolutionsInstallmentsMentionTemplate = document.querySelector('#scalexpert-installments-mention');
    }

    setDatas(datas = {}) {
        if (this.devMode && this.devMode.active) {
            console.info(this.devMode.label + 'setDatas');
        }

        if (datas) {
            this.feesSolutions = [
                'SCFRSP-3XPS',
                'SCFRSP-4XPS',
                'SCFRLT-TXPS',
            ]
            this.longSolutions = [
                'SCFRLT-TXPS',
                'SCFRLT-TXNO',
                'SCFRLT-TXTS',
            ];
            this.currencies = {
                'US': { code: "USD", locale: "en-US" },
                'FR': { code: "EUR", locale: "fr-FR" },
            }

            this.solutionCodes = [];
            this.communicationKit = [];

            for (let solutionsKey in datas.solutions) {
                if(datas.solutions[solutionsKey].solutionCode) {
                    this.solutionCodes.push(datas.solutions[solutionsKey].solutionCode);
                    this.communicationKit[datas.solutions[solutionsKey].solutionCode] = datas.solutions[solutionsKey].communicationKit;
                }
            }

            let preparedData = this.prepareData(datas);

            preparedData.anchor = datas.anchor || '';

            this.setSettings(preparedData);
        }
        else {
            if (this.devMode && this.devMode.active) {
                console.error(this.devMode.label + 'datas' + this.devMode.isEmpty);
            }
        }
    }

    display() {
        let scalexpert = document.querySelectorAll(this.settings.anchor);
        if (scalexpert && scalexpert.length) {
            if (this.devMode && this.devMode.active) {
                console.info(this.devMode.label + 'nb in page: ' + scalexpert.length);
            }

            scalexpert.forEach((snippet) => {
                this.simulation = {};

                if (!!snippet) {
                    let idUniqueGlobal = Math.random().toString(16).slice(2);
                    this.settings.scalexpertmodalgroupid = "scalexpertmodalgroupid" + idUniqueGlobal;
                    this.settings.anchorContent = "scalexpertmodalanchorid" + idUniqueGlobal;

                    if (this.devMode && this.devMode.active) {
                        console.log(this.devMode.label + 'scalexpertmodalgroupid: ' + this.settings.scalexpertmodalgroupid);
                        console.log(this.devMode.label + 'scalexpertmodalanchorid: ' + this.settings.anchorContent);
                    }

                    snippet.setAttribute('id', this.settings.anchorContent);

                    if (this.listSolutionsTemplate) {
                        let listSolutions = this.listSolutionsTemplate.content.cloneNode(true);

                        let modal = this.generateModal();
                        let modalContent = modal.querySelector('[data-scalexpertjs="content"]');

                        let listSolutionsContent = listSolutions.querySelector('[data-scalexpertjs="content"]');
                        listSolutionsContent.setAttribute('data-id', this.settings.scalexpertmodalgroupid);

                        if (this.settings.simulations && this.settings.simulations.length) {
                            if (this.devMode && this.devMode.active) {
                                console.info(this.devMode.label + 'nb simulations: ' + this.settings.simulations.length);
                            }

                            this.settings.simulations.forEach((simulation) => {
                                simulation.scalexpertmodalid = "scalexpertmodalid" + Math.random().toString(16).slice(2);
                            });

                            let firstSolution = true;
                            this.settings.simulations.forEach((simulation) => {
                                if (!!simulation) {
                                    if (this.devMode && this.devMode.active) {
                                        console.log(this.devMode.label + 'scalexpertmodalid: ' + simulation.scalexpertmodalid);
                                    }

                                    simulation.firstSolution = firstSolution;
                                    if(firstSolution) {
                                        firstSolution = false;
                                    }

                                    this.simulation = simulation;
                                    listSolutionsContent.append(this.generateSolution());

                                    modalContent.append(this.generateModalSolution());
                                } else if (this.devMode && this.devMode.active) {
                                    console.error(this.devMode.label + 'error load simulation:');
                                    console.log(simulation);
                                }
                            });
                        } else if (this.devMode && this.devMode.active) {
                            console.error(this.devMode.label + 'no simulations found');
                        }

                        snippet.append(listSolutions);
                        document.querySelector('body').append(modal);
                    } else if (this.devMode && this.devMode.active) {
                        console.error(this.devMode.label + 'error load template listSolutionsTemplate');
                    }
                } else if (this.devMode && this.devMode.active) {
                    console.error(this.devMode.label + 'error load snippet:');
                    console.log(snippet);
                }
            });

        } else if (this.devMode && this.devMode.active) {
            if (this.settings.anchor) {
                console.error(this.devMode.label + 'anchor not found: ' + this.settings.anchor);
            } else {
                console.error(this.devMode.label + 'anchor setting is empty');
            }
        }
    }

    generateSolution() {
        if (this.devMode && this.devMode.active) {
            if (!this.simulation.title) {
                console.log('title' + this.devMode.isEmpty);
            } else {
                console.info(this.devMode.label + this.simulation.title + ' x' + (this.simulation.duration || ''));
            }
            if (!this.simulation.infoShortDetailPayment) {
                console.log('infoShortDetailPayment' + this.devMode.isEmpty);
            }
            if (!this.simulation.shortDescriptionLegal) {
                console.log('shortDescriptionLegal' + this.devMode.isEmpty);
            }
        }

        let template = '';
        if (this.listSolutionsSolutionTemplate) {
            template = this.listSolutionsSolutionTemplate.content.cloneNode(true);

            let title = template.querySelector('[data-scalexpertjs="title"]');
            title.innerHTML = (this.simulation.title || '');

            this.setLogo(template);
            this.setIcon(template);
            this.setButtonModal(template);

            template.querySelector('[data-scalexpertjs="content"]').append(this.generateList());

            let infoShortDetailPayment = template.querySelector('[data-scalexpertjs="infoShortDetailPayment"]');
            infoShortDetailPayment.innerHTML = (this.simulation.infoShortDetailPayment || '');

            let shortDescriptionLegal = template.querySelector('[data-scalexpertjs="shortDescriptionLegal"]');
            shortDescriptionLegal.innerHTML = (this.simulation.shortDescriptionLegal || '');

            let item = template.querySelector('[data-scalexpertjs="solutionid"]');
            item.setAttribute('data-id', this.simulation.scalexpertmodalid);

            if(this.simulation.firstSolution) {
                this.showHideItem(item, true);
            }
        } else if (this.devMode && this.devMode.active) {
            console.error(this.devMode.label + 'error load template listSolutionsSolutionTemplate');
        }
        return template;
    }

    generateList() {
        let template = '';
        if (this.listSolutionsSolutionListTemplate) {
            template = this.listSolutionsSolutionListTemplate.content.cloneNode(true);

            if (this.settings.simulations && this.settings.simulations.length) {
                this.settings.simulations.forEach((simulation) => {
                    template.querySelector('[data-scalexpertjs="content"]').append(this.generateItem(simulation));
                });
            }
        } else if (this.devMode && this.devMode.active) {
            console.error(this.devMode.label + 'error load template listSolutionsSolutionListTemplate');
        }
        return template;
    }

    generateItem(simulation) {
        if (this.devMode && this.devMode.active) {
            if (!simulation.duration) {
                console.log('duration' + this.devMode.isEmpty);
            }
        }

        let template = '';
        if (this.listSolutionsSolutionListItemTemplate) {
            template = this.listSolutionsSolutionListItemTemplate.content.cloneNode(true);

            let item = template.querySelector('[data-scalexpertjs="item"]');
            item.innerHTML = 'x' + (simulation.duration || '');

            item.setAttribute('data-groupid', this.settings.scalexpertmodalgroupid);
            item.setAttribute('data-id', simulation.scalexpertmodalid);
            item.setAttribute('aria-label', 'Simulation en ' + (simulation.duration || '') + ' fois');

            if (this.simulation.scalexpertmodalid === simulation.scalexpertmodalid) {
                item.setAttribute('data-current', 'true');
            } else {
                let anchorContent = this.settings.anchorContent;
                let scalexpertmodalgroupid = this.settings.scalexpertmodalgroupid;

                item.addEventListener('click', (e) => {
                    let allGroupSolution = document.querySelectorAll('#' + anchorContent + ', #' + scalexpertmodalgroupid);

                    e.preventDefault();
                    let currentItem = e.target;

                    if (this.devMode && this.devMode.active) {
                        console.log(this.devMode.label + 'event click select solution: ' + currentItem.getAttribute('data-id'));
                    }

                    allGroupSolution.forEach((groupSolution) => {
                        groupSolution.querySelectorAll('.scalexpertjs-solution').forEach((item) => {
                            this.showHideItem(item, false);
                        });

                        groupSolution.querySelectorAll('.scalexpertjs-solution[data-id="' + currentItem.getAttribute('data-id') + '"]').forEach((item) => {
                            this.showHideItem(item, true);

                            item.querySelector('[data-scalexpertjs="item"][data-current="true"]').focus()
                        });
                    })

                });
            }
        } else if (this.devMode && this.devMode.active) {
            console.error(this.devMode.label + 'error load template listSolutionsSolutionListItemTemplate');
        }
        return template;
    }

    setLogo(template) {
        if (this.devMode && this.devMode.active) {
            if (typeof this.simulation.displayLogo === 'undefined') {
                console.log('displayLogo' + this.devMode.isEmpty);
            } else if (!this.simulation.logoUrl) {
                console.log('logoUrl' + this.devMode.isEmpty);
            }
        }

        let logo = template.querySelector('[data-scalexpertjs="logo"]');
        if (this.simulation.displayLogo) {
            logo.setAttribute('src', (this.simulation.logoUrl || ''));
            logo.setAttribute('alt', (this.simulation.title || ''));
        } else {
            logo.style.display = 'none';
            logo.parentElement.removeChild(logo);
        }
    }

    setIcon(template) {
        if (this.devMode && this.devMode.active) {
            if (!this.simulation.informationIconUrl) {
                console.log('informationIconUrl' + this.devMode.isEmpty);
            }
        }
        let icon = template.querySelector('[data-scalexpertjs="icon"]');
        icon.setAttribute('src', (this.simulation.informationIconUrl || ''));

    }

    setButtonModal(template) {
        let button = template.querySelector('[data-scalexpertjs="buttonModal"]');

        button.setAttribute('data-groupid', this.settings.scalexpertmodalgroupid);
        button.setAttribute('aria-label', 'Overture modale, détail simulation : ' + (this.simulation.title || ''));

        let _that = this;

        button.addEventListener('click', (e) => {
            if (this.devMode && this.devMode.active) {
                console.log(this.devMode.label + 'event click "i" open modal: ' + button.getAttribute('data-groupid'));
            }
            e.preventDefault();
            this.openModal(button.getAttribute('data-groupid'));
            button.setAttribute('data-lastfocus', 'true');
        });
    }

    generateModal() {
        let template = '';
        if (this.listSolutionsModalTemplate) {
            template = this.listSolutionsModalTemplate.content.cloneNode(true);
            let modal = template.querySelector('[data-scalexpertjs="solutiongroupid"]');
            modal.setAttribute('id', this.settings.scalexpertmodalgroupid);
            modal.setAttribute('aria-label', 'Détail de la simulation');

            let overlay = template.querySelector('[data-scalexpertjs="modaloverlay"]');
            overlay.addEventListener('click', (e) => {
                if (this.devMode && this.devMode.active) {
                    console.log(this.devMode.label + 'event click overlay modal');
                }
                e.preventDefault();
                this.closeModals();
            });

            this.modals.push(modal);
        } else if (this.devMode && this.devMode.active) {
            console.error(this.devMode.label + 'error load template listSolutionsModalTemplate');
        }
        return template;
    }

    generateModalSolution() {
        if (this.devMode && this.devMode.active) {
            if (!this.simulation.additionalInformation) {
                console.log('additionalInformation' + this.devMode.isEmpty);
            }
            if (!this.simulation.infoLongDetailPayment) {
                console.log('infoLongDetailPayment' + this.devMode.isEmpty);
            }
            if (!this.simulation.legalText) {
                console.log('legalText' + this.devMode.isEmpty);
            }
        }

        let template = '';
        if (this.listSolutionsModalSolutionTemplate) {
            template = this.listSolutionsModalSolutionTemplate.content.cloneNode(true);

            let title = template.querySelector('[data-scalexpertjs="title"]');
            title.innerHTML = (this.simulation.title || '');

            this.setLogo(template);

            let close = template.querySelector('[data-scalexpertjs="close"]');
            close.setAttribute('data-groupid', this.settings.scalexpertmodalgroupid);

            close.addEventListener('click', (e) => {
                if (this.devMode && this.devMode.active) {
                    console.log(this.devMode.label + 'event click cross modal');
                }
                e.preventDefault();
                this.closeModals();
            });

            let additionalInformation = template.querySelector('[data-scalexpertjs="additionalInformation"]');
            additionalInformation.innerHTML = (this.simulation.additionalInformation || '');

            template.querySelector('[data-scalexpertjs="content"]').append(this.generateList());

            let infoLongDetailPayment = template.querySelector('[data-scalexpertjs="infoLongDetailPayment"]');
            infoLongDetailPayment.innerHTML = (this.simulation.infoLongDetailPayment || '');

            this.generateInstallments(template.querySelector('[data-scalexpertjs="installments"]'));
            this.generateMentions(template.querySelector('[data-scalexpertjs="mentions"]'));

            let legalText = template.querySelector('[data-scalexpertjs="legalText"]');
            legalText.innerHTML = (this.simulation.legalText || '');

            let item = template.querySelector('[data-scalexpertjs="solutionid"]');
            item.setAttribute('data-id', this.simulation.scalexpertmodalid);

            if(this.simulation.firstSolution) {
                this.showHideItem(item, true);
            }

        } else if (this.devMode && this.devMode.active) {
            console.error(this.devMode.label + 'error load template listSolutionsModalSolutionTemplate');
        }
        return template;
    }

    generateInstallments(installments) {
        if (this.simulation.installmentsItems && this.simulation.installmentsItems.length) {
            if (this.devMode && this.devMode.active) {
                console.info(this.devMode.label + 'nb installments: ' + this.simulation.installmentsItems.length);
            }

            this.simulation.installmentsItems.forEach((item) => {
                if (!!item) {
                    let itemTemplate = '';
                    if (this.listSolutionsInstallmentsItemTemplate) {
                        let itemTemplate = this.listSolutionsInstallmentsItemTemplate.content.cloneNode(true);
                        let itemValue = itemTemplate.querySelector('[data-scalexpertjs="item"]');
                        itemValue.innerHTML = (item || '');
                        installments.append(itemTemplate);

                    } else if (this.devMode && this.devMode.active) {
                        console.error(this.devMode.label + 'error load template listSolutionsInstallmentsItemTemplate');
                    }
                } else if (this.devMode && this.devMode.active) {
                    console.error(this.devMode.label + 'error load installmentsItems:');
                }
            });
        } else if (this.devMode && this.devMode.active) {
            console.error(this.devMode.label + 'no installments found');
        }
    }

    generateMentions(mentions) {
        if (this.simulation.installmentsMentions && this.simulation.installmentsMentions.length) {
            if (this.devMode && this.devMode.active) {
                console.info(this.devMode.label + 'nb installmentsMentions: ' + this.simulation.installmentsMentions.length);
            }
            this.simulation.installmentsMentions.forEach((item) => {
                if (!!item) {
                    let itemTemplate = '';
                    if (this.listSolutionsInstallmentsMentionTemplate) {
                        itemTemplate = this.listSolutionsInstallmentsMentionTemplate.content.cloneNode(true);
                        let itemValue = itemTemplate.querySelector('[data-scalexpertjs="item"]');
                        itemValue.innerHTML = (item || '');
                        mentions.append(itemTemplate);
                    } else if (this.devMode && this.devMode.active) {
                        console.error(this.devMode.label + 'error load template listSolutionsInstallmentsMentionTemplate');
                    }
                } else if (this.devMode && this.devMode.active) {
                    console.error(this.devMode.label + 'error load installmentsMentions:');
                }
            });
        } else if (this.devMode && this.devMode.active) {
            console.error(this.devMode.label + 'no installmentsMentions found');
        }
    }

    openModal(idGroupModal) {
        if(idGroupModal && document.querySelector('#' + idGroupModal)) {
            let modal = document.querySelector('#' + idGroupModal);
            modal.setAttribute('data-display', 'true');

            let close = modal.querySelector('[data-scalexpertjs="solutionid"][data-display="true"] [data-scalexpertjs="close"]');
            if(typeof close === 'undefined' || close === null) {
                close = modal.querySelector('[data-scalexpertjs="solutionid"]:first-child [data-scalexpertjs="close"]');
            }
            document.querySelector('html').setAttribute('data-modal-position', window.scrollY );
            close.focus();
        }

        window.scroll({top: 0, left: 0, behavior: 'smooth'});
    }

    closeModals() {
        if (this.modals && this.modals.length) {
            if (this.devMode && this.devMode.active) {
                console.info(this.devMode.label + 'close modals');
            }

            this.modals.forEach((item) => {
                if (item.getAttribute('data-display') === 'true') {
                    item.setAttribute('data-display', 'false');

                    let lastFocusItem = document.querySelector('[data-scalexpertjs="content"][data-id="' + item.getAttribute('id') + '"] [data-scalexpertjs="solutionid"][data-display="true"] [data-scalexpertjs="buttonModal"]');

                    if(typeof lastFocusItem === 'undefined' || lastFocusItem === null) {
                        lastFocusItem = document.querySelector('[data-scalexpertjs="content"][data-id="' + item.getAttribute('id') + '"] [data-scalexpertjs="solutionid"]:first-child [data-scalexpertjs="buttonModal"]');
                    }

                    lastFocusItem.focus();

                    window.scroll({top: document.querySelector('html').getAttribute('data-modal-position'), left: 0, behavior: 'smooth'});

                    if (this.devMode && this.devMode.active) {
                        console.log(this.devMode.label + 'Modal close: ' + item.getAttribute('id'));
                    }
                }
            });
        }
    }

    showHideItem(item, showHide = false) {
        if (showHide) {
            item.setAttribute('data-display', 'true');
            item.setAttribute('aria-hidden', 'false');
        }
        else {
            item.setAttribute('data-display', 'false');
            item.setAttribute('aria-hidden', 'true');
        }
    }

    prepareData(data) {
        if(
            typeof data === 'object' && data && data.buyerBillingCountry &&
            data.solutionSimulations.length &&
            typeof Intl === 'object' && typeof Intl.NumberFormat === 'function'
        ) {
            if(!this.currencies[data.buyerBillingCountry]) {
                this.currencies[data.buyerBillingCountry] = {
                    locale: 'fr-FR',
                    code: 'EUR'
                }
            }

            this.NumberFormat = new Intl.NumberFormat(this.currencies[data.buyerBillingCountry].locale, {
                style: 'currency',
                currency: this.currencies[data.buyerBillingCountry].code,
            });

            const formatPercent = (percent) => `${percent.toFixed(2)} %`;

            let preparedData = {
                simulations : []
            };

            for (const i in data.solutionSimulations) {
                if(typeof data.solutionSimulations[i] === 'object' && data.solutionSimulations[i].simulations.length) {
                    for (const j in data.solutionSimulations[i].simulations) {
                        const solutionCode = data.solutionSimulations[i].solutionCode;

                        let simulationData = {
                            financedAmountFormatted: this.currencyFormatter(data.financedAmount),
                            dueTotalAmountFormatted: this.currencyFormatter(data.solutionSimulations[i].simulations[j].dueTotalAmount),
                            feesAmount: data.solutionSimulations[i].simulations[j].feesAmount,
                            feesAmountFormatted: this.currencyFormatter(data.solutionSimulations[i].simulations[j].feesAmount),
                            totalCost: data.solutionSimulations[i].simulations[j].totalCost,
                            totalCostFormatted: this.currencyFormatter(data.solutionSimulations[i].simulations[j].totalCost),
                            effectiveAnnualPercentageRateFormatted: formatPercent(data.solutionSimulations[i].simulations[j].effectiveAnnualPercentageRate),
                            nominalPercentageRateFormatted: formatPercent(data.solutionSimulations[i].simulations[j].nominalPercentageRate),

                            isLongFinancingSolution: this.longSolutions.includes(solutionCode),
                            hasFeesOnFirstInstallment: this.feesSolutions.includes(solutionCode),

                            title: this.communicationKit[solutionCode].visualTitle,
                            shortDescriptionLegal: this.communicationKit[solutionCode].visualDescription,
                            informationIconUrl: this.communicationKit[solutionCode].visualInformationIcon,
                            logoUrl: this.communicationKit[solutionCode].visualLogo,

                            displayLogo: true,

                            duration: data.solutionSimulations[i].simulations[j].duration,
                            additionalInformation: this.communicationKit[solutionCode].visualAdditionalInformation,
                            legalText: this.communicationKit[solutionCode].visualLegalText,
                            infoShortDetailPayment: '',
                            infoLongDetailPayment: '',

                            installmentsItems: [],
                            installmentsMentions: []
                        };

                        simulationData.installmentsItems.push('<span>Montant total dû</span><span>' + simulationData.dueTotalAmountFormatted + '</span>');
                        for (const k in data.solutionSimulations[i].simulations[j].installments) {
                            simulationData.installmentsItems.push(this.formatItemInstallment(data.solutionSimulations[i].simulations[j].installments[k], simulationData));
                        }

                        simulationData.installmentsMentions = this.formatItemMentions(simulationData);

                        simulationData.infoShortDetailPayment = this.formatInfoShortDetailPayment(data.solutionSimulations[i].simulations[j].installments, simulationData);
                        simulationData.infoLongDetailPayment = this.formatInfoLongDetailPayment(data.solutionSimulations[i].simulations[j].installments, simulationData);

                        preparedData.simulations.push(simulationData);
                    }
                }
            }

            preparedData.simulations.sort((a, b) => a.duration - b.duration);

            return preparedData;
        }

        if (this.devMode && this.devMode.active) {
            console.error(this.devMode.label + 'prepareData error load data');
        }

        return {};
    }

    formatItemInstallment(itemInstallment, simulationData) {
        let label = '';
        let value = '';

        if (simulationData.isLongFinancingSolution) {
            label = 'Payer en ' + simulationData.duration + ' fois';
        } else {
            if (itemInstallment.number <= 1) {
                label = 'Aujourd\'hui';
            } else {
                label = itemInstallment.number + 'ème prélèvement';
            }
        }

        value = this.currencyFormatter(itemInstallment.amount);

        return '<span>' + label + '</span><span>' + value + '</span>';
    }

    formatItemMentions(simulationData) {
        let installmentsMentions = [];

        installmentsMentions.push('Montant du financement : ' + simulationData.financedAmountFormatted + '. ');
        installmentsMentions.push('TAEG FIXE : ' + simulationData.effectiveAnnualPercentageRateFormatted + '. ');

        if (simulationData.isLongFinancingSolution) {
            installmentsMentions.push('TAEG FIXE : ' + simulationData.nominalPercentageRateFormatted + '. ');
            installmentsMentions.push('Coût du crédit : ' + simulationData.totalCostFormatted + '.<br>');
            installmentsMentions.push('Frais de dossier : ' + simulationData.feesAmountFormatted + '. ');
        }
        else {
            installmentsMentions.push('Frais : ' + simulationData.feesAmountFormatted + '. ');
        }

        installmentsMentions.push('Montant total dû : ' + simulationData.dueTotalAmountFormatted + '. ');

        return installmentsMentions;
    }

    formatInfoShortDetailPayment(installments, simulationData) {
        let _return = '';

        if(simulationData.hasFeesOnFirstInstallment && 0 < simulationData.feesAmount) {
            _return += '<span class="scalexpert-bold">soit un 1er prélèvement de <span class="scalexpert-highlight">' + this.currencyFormatter(installments[0].amount) + '</span>';
            if(simulationData.totalCost) {
                _return += ' (frais inclus)';
            }
            _return += ' puis ' + (simulationData.duration - 1) + ' prélèvements de <span class="scalexpert-highlight">' + this.currencyFormatter(installments[1].amount) + '</span></span>';
        }
        else {
            _return += '<span class="scalexpert-bold">soit <span class="scalexpert-highlight">' + this.currencyFormatter(installments[0].amount) + ' / mois</span></span>';
        }

        return _return;
    }

    formatInfoLongDetailPayment(installments, simulationData) {
        let _return = '';

        if(simulationData.hasFeesOnFirstInstallment && 0 < simulationData.feesAmount) {
            _return += 'soit un <span class="scalexpert-highlight">1er prélèvement</span> de <span class="scalexpert-highlight">' + this.currencyFormatter(installments[0].amount) + '</span>';
            if(simulationData.totalCost) {
                _return += ' (frais inclus)';
            }
            _return += ' puis <span class="scalexpert-highlight">' + (simulationData.duration - 1) + ' prélèvements</span> de <span class="scalexpert-highlight">' + this.currencyFormatter(installments[1].amount) + '</span>';
        }
        else {
            _return += 'soit <span class="scalexpert-highlight">' + simulationData.duration + ' prélèvements</span> de <span class="scalexpert-highlight">' + this.currencyFormatter(installments[0].amount) + '</span>';
        }

        return _return;
    }

    currencyFormatter(number) {
        if(!isNaN(number) && this.NumberFormat) {
            return this.NumberFormat.format(number);
        }
        return '';
    }
}
